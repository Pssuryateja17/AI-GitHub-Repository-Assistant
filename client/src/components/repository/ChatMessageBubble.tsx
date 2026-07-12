import { ChatMessage } from '../../api/chatApi';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function formatTime(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(isoDate));
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-colors duration-300 ${
            isUser
              ? 'bg-brand-600 text-white'
              : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          <p className="whitespace-pre-line">{message.content}</p>
        </div>
        <span className="px-1 text-[11px] text-slate-400 dark:text-slate-500">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}