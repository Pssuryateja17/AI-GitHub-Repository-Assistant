export function ChatTypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s] dark:bg-slate-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s] dark:bg-slate-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
      </div>
    </div>
  );
}