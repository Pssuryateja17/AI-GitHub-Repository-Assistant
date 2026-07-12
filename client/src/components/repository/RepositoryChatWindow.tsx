import { useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatService } from '../../api/chatApi';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import { ChatInput } from './ChatInput';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { ErrorAlert } from './ErrorAlert';

interface RepositoryChatWindowProps {
  repositoryUrl?: string;
  repositoryId?: string;
  repositoryLabel: string;
}

export function RepositoryChatWindow({
  repositoryUrl,
  repositoryId,
  repositoryLabel,
}: RepositoryChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  async function handleSend(question: string): Promise<void> {
    setError(null);

    const optimisticUserMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((previous) => [...previous, optimisticUserMessage]);
    setIsLoading(true);

    try {
      const result = await ChatService.askQuestion({ repositoryId, repositoryUrl, question });
      setMessages(result.history);
    } catch (caughtError) {
      setError(extractErrorMessage(caughtError));
      // Roll back the optimistic message since the backend never confirmed it.
      setMessages((previous) => previous.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[32rem] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-950">
      <div className="border-b border-slate-200 bg-white px-4 py-3 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          Chatting about{' '}
          <span className="font-bold text-brand-600 dark:text-brand-400">{repositoryLabel}</span>
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Questions are answered using this repository's analysis only.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-400 dark:text-slate-500">
            Ask anything about this repository - its purpose, architecture, setup, or how to
            contribute.
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessageBubble key={`${message.timestamp}-${index}`} message={message} />
          ))
        )}

        {isLoading ? <ChatTypingIndicator /> : null}

        <div ref={messagesEndRef} />
      </div>

      {error ? (
        <div className="px-4 pb-2">
          <ErrorAlert error={error} onDismiss={() => setError(null)} />
        </div>
      ) : null}

      <ChatInput onSend={(question) => void handleSend(question)} isLoading={isLoading} />
    </div>
  );
}