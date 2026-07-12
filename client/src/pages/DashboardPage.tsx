import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosClient } from '../api/axiosClient';
import { Navbar } from '../components/Navbar';
import { DashboardStatsCharts } from '../components/repository/DashboardStatsCharts';
import { useAuth } from '../context/AuthContext';

interface HistoryEntry {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  analysis: { difficulty?: string };
  createdAt: string;
}

interface SavedEntry {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  createdAt: string;
}

interface PaginatedHistoryResponse {
  items: HistoryEntry[];
  total: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

type ActivityItem =
  | { type: 'analysis'; id: string; repositoryFullName: string; createdAt: string }
  | { type: 'saved'; id: string; repositoryFullName: string; createdAt: string };

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function DashboardPage() {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<HistoryEntry[]>([]);
  const [totalAnalyses, setTotalAnalyses] = useState<number | null>(null);
  const [savedRepositories, setSavedRepositories] = useState<SavedEntry[]>([]);
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData(): Promise<void> {
      try {
        const [historyResponse, savedResponse] = await Promise.all([
          axiosClient.get<ApiSuccessResponse<PaginatedHistoryResponse>>('/history', {
            params: { page: 1, pageSize: 5 },
          }),
          axiosClient.get<ApiSuccessResponse<SavedEntry[]>>('/saved'),
        ]);

        if (!isMounted) return;

        setRecentAnalyses(historyResponse.data.data.items);
        setTotalAnalyses(historyResponse.data.data.total);
        setSavedRepositories(savedResponse.data.data);
      } catch {
        // Widgets are supplementary; the rest of the dashboard still renders if these fail
        // (e.g. history/saved endpoints not yet available on the backend).
      } finally {
        if (isMounted) setIsLoadingWidgets(false);
      }
    }

    void loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const recentActivity: ActivityItem[] = [
    ...recentAnalyses.map(
      (entry): ActivityItem => ({
        type: 'analysis',
        id: entry.id,
        repositoryFullName: entry.repositoryFullName,
        createdAt: entry.createdAt,
      }),
    ),
    ...savedRepositories.map(
      (entry): ActivityItem => ({
        type: 'saved',
        id: entry.id,
        repositoryFullName: entry.repositoryFullName,
        createdAt: entry.createdAt,
      }),
    ),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name} 👋</h1>
        <p className="mt-2 text-sm text-slate-500">
          This is your dashboard. GitHub repository connection and AI analysis tools will appear
          here in upcoming modules.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Account</h2>
            <p className="mt-2 text-sm text-slate-500">Email: {user?.email}</p>
            <p className="mt-1 text-sm text-slate-500">
              Joined: {user ? new Date(user.createdAt).toLocaleDateString() : ''}
            </p>
          </div>
          <Link
            to="/analyze"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">
              Repository Analyzer
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Paste any public GitHub repository URL and get an AI-generated breakdown of its
              purpose, architecture, and learning roadmap.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand-600 group-hover:underline">
              Analyze a repository &rarr;
            </span>
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isLoadingWidgets ? '—' : (totalAnalyses ?? 0)}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Analyses
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isLoadingWidgets ? '—' : savedRepositories.length}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Saved Repositories
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isLoadingWidgets ? '—' : recentActivity.length}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Recent Activity
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isLoadingWidgets
                ? '—'
                : (recentAnalyses[0]?.analysis.difficulty ?? '—')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Last Difficulty
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link
              to="/analyze"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-brand-300 hover:text-brand-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700"
            >
              Analyze
            </Link>
            <Link
              to="/compare"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-brand-300 hover:text-brand-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700"
            >
              Compare
            </Link>
            <Link
              to="/history"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-brand-300 hover:text-brand-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700"
            >
              History
            </Link>
            <Link
              to="/saved"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-brand-300 hover:text-brand-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700"
            >
              Saved
            </Link>
          </div>
        </div>

        {/* Recent Analyses + Saved Repositories */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Recent Analyses
              </h2>
              <Link
                to="/history"
                className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                View all
              </Link>
            </div>

            {recentAnalyses.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
                {isLoadingWidgets ? 'Loading...' : 'No analyses yet.'}
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2.5">
                {recentAnalyses.slice(0, 3).map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-2">
                    <a
                      href={entry.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-slate-700 hover:text-brand-600 hover:underline dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {entry.repositoryFullName}
                    </a>
                    <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                      {formatRelativeDate(entry.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Saved Repositories
              </h2>
              <Link
                to="/saved"
                className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                View all
              </Link>
            </div>

            {savedRepositories.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
                {isLoadingWidgets ? 'Loading...' : 'No saved repositories yet.'}
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2.5">
                {savedRepositories.slice(0, 3).map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-2">
                    <a
                      href={entry.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-slate-700 hover:text-brand-600 hover:underline dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {entry.repositoryFullName}
                    </a>
                    <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                      {formatRelativeDate(entry.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
              {isLoadingWidgets ? 'Loading...' : 'No recent activity yet.'}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {recentActivity.map((item, index) => (
                <li
                  key={`${item.type}-${item.id}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className="flex items-center gap-3 text-sm transition-all duration-300 ease-out"
                >
                  <span
                    className={`h-2 w-2 flex-shrink-0 rounded-full ${
                      item.type === 'analysis' ? 'bg-brand-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.type === 'analysis' ? 'Analyzed' : 'Saved'}{' '}
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.repositoryFullName}
                    </span>
                  </span>
                  <span className="ml-auto flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {formatRelativeDate(item.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Statistics Charts */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Statistics
          </h2>
          <DashboardStatsCharts />
        </div>
      </main>
    </div>
  );
}
