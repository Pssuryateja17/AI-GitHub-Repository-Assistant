import { useEffect, useState } from 'react';
import { SavedRepositoryService } from '../../api/savedRepositoryApi';
import { AnalysisResponse, LoadingState } from '../../types/github';
import { AnalysisCard } from './AnalysisCard';
import { ErrorAlert } from './ErrorAlert';
import { ExportButtons } from './ExportButtons';
import { FavoriteButton } from './FavoriteButton';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AnalysisSectionProps {
  status: LoadingState;
  data: AnalysisResponse | null;
  error: string | null;
  onDismissError?: () => void;
}

export function AnalysisSection({ status, data, error, onDismissError }: AnalysisSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [isSaveToggling, setIsSaveToggling] = useState(false);

  useEffect(() => {
    if (status === 'success' && data) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setIsVisible(false);
    return undefined;
  }, [status, data]);

  useEffect(() => {
    let isMounted = true;

    async function checkIfSaved(): Promise<void> {
      if (!data) {
        setSavedEntryId(null);
        return;
      }

      try {
        const savedRepositories = await SavedRepositoryService.getSavedRepositories();
        if (!isMounted) return;

        const match = savedRepositories.find(
          (entry) => entry.repositoryFullName === data.repository.fullName,
        );
        setSavedEntryId(match ? match.id : null);
      } catch {
        if (isMounted) setSavedEntryId(null);
      }
    }

    void checkIfSaved();
    return () => {
      isMounted = false;
    };
  }, [data]);

  async function handleToggleSave(): Promise<void> {
    if (!data || isSaveToggling) return;

    setIsSaveToggling(true);
    try {
      if (savedEntryId) {
        await SavedRepositoryService.unsaveRepository(savedEntryId);
        setSavedEntryId(null);
      } else {
        const created = await SavedRepositoryService.saveRepository({
          repositoryFullName: data.repository.fullName,
          repositoryUrl: data.repository.url,
        });
        setSavedEntryId(created.id);
      }
    } catch {
      // Save/unsave failures are non-fatal to the analysis view; the button
      // simply reflects the last known state and the user can retry.
    } finally {
      setIsSaveToggling(false);
    }
  }

  if (status === 'idle') {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40">
        <LoadingSpinner size="lg" label="Fetching repository data and running AI analysis..." />
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorAlert error={error} onDismiss={onDismissError} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div
      className={`flex w-full flex-col gap-6 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-slate-900 dark:text-slate-100">
              {data.repository.fullName}
            </h1>
            {data.repository.description ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {data.repository.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <FavoriteButton
              isSaved={Boolean(savedEntryId)}
              isLoading={isSaveToggling}
              onToggle={() => void handleToggleSave()}
            />
            <a
              href={data.repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Stars', value: data.repository.stars.toLocaleString() },
            { label: 'Forks', value: data.repository.forks.toLocaleString() },
            { label: 'Open Issues', value: data.repository.openIssues.toLocaleString() },
            { label: 'Contributors', value: data.repository.contributorsCount.toLocaleString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-slate-50 px-3 py-2 text-center transition-colors duration-300 dark:bg-slate-800/60"
            >
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <ExportButtons repositoryUrl={data.repository.url} />
        </div>
      </header>

      <div
        style={{ transitionDelay: '80ms' }}
        className={`transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <AnalysisCard analysis={data.analysis} />
      </div>

      {data.readme ? (
        <div
          style={{ transitionDelay: '160ms' }}
          className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out dark:border-slate-700 dark:bg-slate-900 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">README</h2>
          <MarkdownRenderer content={data.readme} />
        </div>
      ) : null}
    </div>
  );
}