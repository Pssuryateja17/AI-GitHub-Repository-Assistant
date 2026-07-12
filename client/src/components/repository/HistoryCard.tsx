import { useEffect, useState } from 'react';

interface HistoryCardProps {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  summary?: string;
  difficulty?: string;
  createdAt: string;
  onDelete: (id: string) => void;
  animationDelayMs?: number;
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function HistoryCard({
  id,
  repositoryFullName,
  repositoryUrl,
  summary,
  difficulty,
  createdAt,
  onDelete,
  animationDelayMs = 0,
}: HistoryCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), animationDelayMs);
    return () => window.clearTimeout(timeout);
  }, [animationDelayMs]);

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700 sm:flex-row sm:items-start sm:justify-between ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-bold text-slate-900 hover:text-brand-600 hover:underline dark:text-slate-100 dark:hover:text-brand-400"
          >
            {repositoryFullName}
          </a>
          {difficulty ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {difficulty}
            </span>
          ) : null}
        </div>

        {summary ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {summary}
          </p>
        ) : null}

        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Analyzed {formatDate(createdAt)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(id)}
        aria-label={`Delete history entry for ${repositoryFullName}`}
        className="flex-shrink-0 self-start rounded-lg p-2 text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9ZM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8Zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
