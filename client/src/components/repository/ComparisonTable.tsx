import { ComparisonWinner, WinnerBadge } from './WinnerBadge';

interface NumericMetric {
  repositoryA: number;
  repositoryB: number;
  winner: ComparisonWinner;
}

interface TechnologyComparison {
  shared: string[];
  uniqueToA: string[];
  uniqueToB: string[];
}

interface DifficultyComparison {
  repositoryA: string;
  repositoryB: string;
  verdict: string;
}

interface LearningCurveComparison {
  repositoryA: string;
  repositoryB: string;
  verdict: string;
}

interface ComparisonTableProps {
  repositoryAName: string;
  repositoryBName: string;
  stars: NumericMetric;
  forks: NumericMetric;
  openIssues: NumericMetric;
  technologies: TechnologyComparison;
  difficulty: DifficultyComparison;
  learningCurve: LearningCurveComparison;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
}

export function ComparisonTable({
  repositoryAName,
  repositoryBName,
  stars,
  forks,
  openIssues,
  technologies,
  difficulty,
  learningCurve,
}: ComparisonTableProps) {
  const numericRows: Array<{ label: string; metric: NumericMetric }> = [
    { label: 'Stars', metric: stars },
    { label: 'Forks', metric: forks },
    { label: 'Open Issues', metric: openIssues },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/60">
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">
                Metric
              </th>
              <th className="truncate px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                {repositoryAName}
              </th>
              <th className="truncate px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                {repositoryBName}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">
                Winner
              </th>
            </tr>
          </thead>
          <tbody>
            {numericRows.map((row, index) => (
              <tr
                key={row.label}
                style={{ transitionDelay: `${index * 60}ms` }}
                className="border-b border-slate-100 transition-colors duration-300 last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                  {row.label}
                </td>
                <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                  {formatNumber(row.metric.repositoryA)}
                </td>
                <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                  {formatNumber(row.metric.repositoryB)}
                </td>
                <td className="px-4 py-3">
                  <WinnerBadge
                    winner={row.metric.winner}
                    labelA={repositoryAName}
                    labelB={repositoryBName}
                  />
                </td>
              </tr>
            ))}

            <tr className="border-b border-slate-100 transition-colors duration-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Difficulty
              </td>
              <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                {difficulty.repositoryA}
              </td>
              <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                {difficulty.repositoryB}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {difficulty.verdict}
              </td>
            </tr>

            <tr className="transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Learning Curve
              </td>
              <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                {learningCurve.repositoryA}
              </td>
              <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                {learningCurve.repositoryB}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {learningCurve.verdict}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 p-4 transition-colors duration-300 dark:border-slate-700">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Technologies
        </h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          {technologies.shared.length > 0 ? (
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Shared:{' '}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">
                {technologies.shared.join(', ')}
              </span>
            </div>
          ) : null}
          {technologies.uniqueToA.length > 0 ? (
            <div>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                Only in {repositoryAName}:{' '}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">
                {technologies.uniqueToA.join(', ')}
              </span>
            </div>
          ) : null}
          {technologies.uniqueToB.length > 0 ? (
            <div>
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                Only in {repositoryBName}:{' '}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">
                {technologies.uniqueToB.join(', ')}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
