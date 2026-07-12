import { useEffect, useState } from 'react';
import { axiosClient } from '../api/axiosClient';
import { Navbar } from '../components/Navbar';
import { ErrorAlert } from '../components/repository/ErrorAlert';
import { SavedRepositoryCard } from '../components/repository/SavedRepositoryCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { extractErrorMessage } from '../utils/extractErrorMessage';

interface SavedRepositoryEntry {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note: string | null;
  createdAt: string;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

type PageStatus = 'idle' | 'loading' | 'success' | 'error';

export function SavedRepositoriesPage() {
  const [status, setStatus] = useState<PageStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [savedRepositories, setSavedRepositories] = useState<SavedRepositoryEntry[]>([]);
  const [unsavingId, setUnsavingId] = useState<string | null>(null);

  async function loadSavedRepositories(): Promise<void> {
    setStatus('loading');
    setError(null);

    try {
      const response =
        await axiosClient.get<ApiSuccessResponse<SavedRepositoryEntry[]>>('/saved');
      setSavedRepositories(response.data.data);
      setStatus('success');
    } catch (caughtError) {
      setError(extractErrorMessage(caughtError));
      setStatus('error');
    }
  }

  useEffect(() => {
    void loadSavedRepositories();
  }, []);

  async function handleUnsave(id: string): Promise<void> {
    setUnsavingId(id);
    try {
      await axiosClient.delete(`/saved/${id}`);
      setSavedRepositories((previous) => previous.filter((entry) => entry.id !== id));
    } catch (caughtError) {
      setError(extractErrorMessage(caughtError));
    } finally {
      setUnsavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Saved Repositories
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Repositories you have bookmarked for quick access later.
          </p>
        </div>

        {status === 'error' ? (
          <ErrorAlert error={error} onDismiss={() => setStatus('idle')} />
        ) : null}

        {status === 'loading' ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40">
            <LoadingSpinner size="lg" label="Loading saved repositories..." />
          </div>
        ) : null}

        {status === 'success' ? (
          savedRepositories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              No saved repositories yet. Save one from the analyzer to see it here.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {savedRepositories.map((entry, index) => (
                <SavedRepositoryCard
                  key={entry.id}
                  id={entry.id}
                  repositoryFullName={entry.repositoryFullName}
                  repositoryUrl={entry.repositoryUrl}
                  note={entry.note}
                  createdAt={entry.createdAt}
                  onUnsave={(id) => void handleUnsave(id)}
                  isUnsaving={unsavingId === entry.id}
                  animationDelayMs={index * 40}
                />
              ))}
            </div>
          )
        ) : null}
      </main>
    </div>
  );
}
