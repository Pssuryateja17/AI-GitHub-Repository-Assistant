import { useEffect, useState } from 'react';
import { FavoriteButton } from './FavoriteButton';

interface SavedRepositoryCardProps {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note?: string | null;
  createdAt: string;
  onUnsave: (id: string) => void;
  isUnsaving?: boolean;
  animationDelayMs?: number;
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(isoDate));
}

export function SavedRepositoryCard({
  id,
  repositoryFullName,
  repositoryUrl,
  note,
  createdAt,
  onUnsave,
  isUnsaving = false,
  animationDelayMs = 0,
}: SavedRepositoryCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), animationDelayMs);
    return () => window.clearTimeout(timeout);
  }, [animationDelayMs]);

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:border-amber-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-700 sm:flex-row sm:items-start sm:justify-between ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="min-w-0 flex-1">
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm font-bold text-slate-900 hover:text-brand-600 hover:underline dark:text-slate-100 dark:hover:text-brand-400"
        >
          {repositoryFullName}
        </a>

        {note ? (
          <p className="mt-1.5 text-sm italic text-slate-600 dark:text-slate-400">
            &ldquo;{note}&rdquo;
          </p>
        ) : null}

        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Saved {formatDate(createdAt)}
        </p>
      </div>

      <FavoriteButton
        isSaved
        isLoading={isUnsaving}
        onToggle={() => onUnsave(id)}
        className="flex-shrink-0"
      />
    </div>
  );
}
