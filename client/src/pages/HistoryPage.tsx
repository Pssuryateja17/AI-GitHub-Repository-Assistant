import { useEffect, useMemo, useState } from 'react';
import { axiosClient } from '../api/axiosClient';
import { Navbar } from '../components/Navbar';
import { DeleteConfirmation } from '../components/repository/DeleteConfirmation';
import { ErrorAlert } from '../components/repository/ErrorAlert';
import { HistoryCard } from '../components/repository/HistoryCard';
import { SearchBar } from '../components/repository/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { extractErrorMessage } from '../utils/extractErrorMessage';

interface HistoryEntry {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: unknown;
  analysis: {
    summary?: string;
    difficulty?: string;
  };
  createdAt: string;
}

interface PaginatedHistoryResponse {
  items: HistoryEntry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

const PAGE_SIZE = 10;

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

export function HistoryPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadHistory(targetPage: number): Promise<void> {
    setStatus('loading');
    setError(null);

    try {
      const response = await axiosClient.get<ApiSuccessResponse<PaginatedHistoryResponse>>(
        '/history',
        { params: { page: targetPage, pageSize: PAGE_SIZE } },
      );
      setEntries(response.data.data.items);
      setTotalPages(response.data.data.totalPages);
      setPage(response.data.data.page);
      setStatus('success');
    } catch (caughtError) {
      setError(extractErrorMessage(caughtError));
      setStatus('error');
    }
  }

  useEffect(() => {
    void loadHistory(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const visibleEntries = useMemo(() => {
    const filtered = searchQuery
      ? entries.filter((entry) =>
          entry.repositoryFullName.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : entries;

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.repositoryFullName.localeCompare(b.repositoryFullName);
        case 'name-desc':
          return b.repositoryFullName.localeCompare(a.repositoryFullName);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [entries, searchQuery, sortOption]);

  async function handleConfirmDelete(): Promise<void> {
    if (!pendingDeleteId) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/history/${pendingDeleteId}`);
      setEntries((previous) => previous.filter((entry) => entry.id !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (caughtError) {
      setError(extractErrorMessage(caughtError));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Every repository you have analyzed, searchable and sortable.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar onSearch={setSearchQuery} placeholder="Search by repository name..." />
          </div>

          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value as SortOption)}
            aria-label="Sort history"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {status === 'error' ? (
          <ErrorAlert error={error} onDismiss={() => setStatus('idle')} />
        ) : null}

        {status === 'loading' ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40">
            <LoadingSpinner size="lg" label="Loading history..." />
          </div>
        ) : null}

        {status === 'success' ? (
          <>
            {visibleEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                {searchQuery
                  ? 'No history entries match your search.'
                  : 'No analyses yet. Analyze a repository to see it here.'}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleEntries.map((entry, index) => (
                  <HistoryCard
                    key={entry.id}
                    id={entry.id}
                    repositoryFullName={entry.repositoryFullName}
                    repositoryUrl={entry.repositoryUrl}
                    summary={entry.analysis?.summary}
                    difficulty={entry.analysis?.difficulty}
                    createdAt={entry.createdAt}
                    onDelete={setPendingDeleteId}
                    animationDelayMs={index * 40}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </main>

      <DeleteConfirmation
        isOpen={pendingDeleteId !== null}
        title="Delete this history entry?"
        message="This analysis record will be permanently removed."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
