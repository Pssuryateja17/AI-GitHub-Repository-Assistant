import { KeyboardEvent, useState } from 'react';

interface ChatInputProps {
  onSend: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');

  function handleSend(): void {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-slate-200 bg-white p-3 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        rows={1}
        placeholder={placeholder ?? 'Ask a question about this repository...'}
        className="max-h-32 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || isLoading || value.trim().length === 0}
        aria-label="Send message"
        className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition-all duration-200 ease-out hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M3.4 2.6a.75.75 0 00-.98.98l2.2 6.2a.75.75 0 000 .48l-2.2 6.2a.75.75 0 00.98.98l14-7a.75.75 0 000-1.34l-14-7Z" />
          </svg>
        )}
      </button>
    </div>
  );
}