import { ReactNode, useEffect, useMemo, useState } from 'react';
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
import { axiosClient } from '../../api/axiosClient';

interface StatsHistoryEntry {
  id: string;
  repositoryFullName: string;
  metadata: { primaryLanguage?: string | null };
  analysis: { difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' };
  createdAt: string;
}

interface PaginatedHistoryResponse {
  items: StatsHistoryEntry[];
  total: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

const STATS_SAMPLE_SIZE = 100;

const PIE_COLORS = ['#3b6cf6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent): void => setIsDark(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
}

function getLastSevenDayLabels(): string[] {
  const labels: string[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toISOString().slice(0, 10));
  }
  return labels;
}

function ChartContainer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

export function DashboardStatsCharts() {
  const [entries, setEntries] = useState<StatsHistoryEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const isDark = useIsDarkMode();

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    color: isDark ? '#f1f5f9' : '#0f172a',
  };

  useEffect(() => {
    let isMounted = true;

    async function loadStats(): Promise<void> {
      setStatus('loading');
      try {
        const response = await axiosClient.get<ApiSuccessResponse<PaginatedHistoryResponse>>(
          '/history',
          { params: { page: 1, pageSize: STATS_SAMPLE_SIZE } },
        );
        if (!isMounted) return;
        setEntries(response.data.data.items);
        setStatus('success');
      } catch {
        if (isMounted) setStatus('error');
      }
    }

    void loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const languageData = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      const language = entry.metadata?.primaryLanguage || 'Unknown';
      counts.set(language, (counts.get(language) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [entries]);

  const difficultyData = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      const difficulty = entry.analysis?.difficulty ?? 'Unknown';
      counts.set(difficulty, (counts.get(difficulty) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const repositoryData = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      counts.set(
        entry.repositoryFullName,
        (counts.get(entry.repositoryFullName) ?? 0) + 1,
      );
    });
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [entries]);

  const weeklyActivityData = useMemo(() => {
    const dayLabels = getLastSevenDayLabels();
    const counts = new Map<string, number>(dayLabels.map((day) => [day, 0]));

    entries.forEach((entry) => {
      const day = entry.createdAt.slice(0, 10);
      if (counts.has(day)) {
        counts.set(day, (counts.get(day) ?? 0) + 1);
      }
    });

    return dayLabels.map((day) => ({
      day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      count: counts.get(day) ?? 0,
    }));
  }, [entries]);

  if (status === 'error') {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
        Statistics are unavailable right now.
      </div>
    );
  }

  if (status !== 'success' || entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
        {status === 'loading' ? 'Loading statistics...' : 'Analyze a repository to see statistics here.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ChartContainer title="Languages Analyzed">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languageData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {languageData.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '0.75rem', color: axisColor }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Difficulty Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={difficultyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {difficultyData.map((entry) => (
                <Cell key={entry.name} fill={DIFFICULTY_COLORS[entry.name] ?? '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '0.75rem', color: axisColor }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Repositories Analyzed (Top 5)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={repositoryData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: axisColor, fontSize: 11 }}
              tickFormatter={(value: string) => (value.length > 16 ? `${value.slice(0, 16)}...` : value)}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="#3b6cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Weekly Activity">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
