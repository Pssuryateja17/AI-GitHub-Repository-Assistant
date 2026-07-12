interface FavoriteButtonProps {
  isSaved: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  className?: string;
}

export function FavoriteButton({
  isSaved,
  isLoading = false,
  onToggle,
  className,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved repositories' : 'Save repository'}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${
        isSaved
          ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
          : 'border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-700 dark:hover:text-amber-400'
      } ${className ?? ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isSaved ? 0 : 1.5}
        aria-hidden="true"
        className={`h-4 w-4 transition-transform duration-300 ease-out ${
          isSaved ? 'scale-110' : 'scale-100'
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 3.5 12.09 7.9l4.91.71-3.55 3.46.84 4.9L10 14.6l-4.29 2.36.84-4.9L3 8.6l4.91-.71L10 3.5Z"
        />
      </svg>
      {isLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
    </button>
  );
}
