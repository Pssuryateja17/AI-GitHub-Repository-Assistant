import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnalyticsOverview, AnalyticsService } from '../api/analyticsApi';
import { Navbar } from '../components/Navbar';
import { ErrorAlert } from '../components/repository/ErrorAlert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { extractErrorMessage } from '../utils/extractErrorMessage';

type PageStatus = 'idle' | 'loading' | 'success' | 'error';

const PIE_COLORS = ['#3b6cf6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
  Unknown: '#94a3b8',
};

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent): void => setIsDark(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
}

function StatCard({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      {note ? (
        <p className="mt-1 text-[10px] leading-tight text-slate-400 dark:text-slate-500">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export function AnalyticsDashboardPage() {
  const [status, setStatus] = useState<PageStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const isDark = useIsDarkMode();

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      color: isDark ? '#f1f5f9' : '#0f172a',
    }),
    [isDark],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadOverview(): Promise<void> {
      setStatus('loading');
      setError(null);
      try {
        const result = await AnalyticsService.getOverview();
        if (!isMounted) return;
        setOverview(result);
        setStatus('success');
      } catch (caughtError) {
        if (!isMounted) return;
        setError(extractErrorMessage(caughtError));
        setStatus('error');
      }
    }

    void loadOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  const languageChartData = useMemo(
    () =>
      (overview?.languageDistribution ?? [])
        .map((entry) => ({ name: entry.language, value: entry.count }))
        .slice(0, 6),
    [overview],
  );

  const difficultyChartData = useMemo(
    () => (overview?.difficultyDistribution ?? []).map((entry) => ({
      name: entry.difficulty,
      value: entry.count,
    })),
    [overview],
  );

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            An overview of your repository analysis activity.
          </p>
        </div>

        {status === 'error' ? <ErrorAlert error={error} onDismiss={() => setStatus('idle')} /> : null}

        {status === 'loading' ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40">
            <LoadingSpinner size="lg" label="Loading analytics..." />
          </div>
        ) : null}

        {status === 'success' && overview ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Repositories Analyzed" value={overview.totalAnalyses} />
              <StatCard label="Saved Repositories" value={overview.totalSaved} />
              <StatCard
                label="Comparisons"
                value={overview.totalComparisons}
                note={overview.totalComparisonsNote}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Language Distribution
                </h3>
                <div className="h-64 w-full">
                  {languageChartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                      No data yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languageChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                        >
                          {languageChartData.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: '0.75rem', color: axisColor }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Difficulty Distribution
                </h3>
                <div className="h-64 w-full">
                  {difficultyChartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                      No data yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={difficultyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {difficultyChartData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={DIFFICULTY_COLORS[entry.name] ?? '#94a3b8'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}