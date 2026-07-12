import { RepositoryMetadata } from '../../types/github';

interface RepositorySummaryProps {
  repository: RepositoryMetadata;
}

const LANGUAGE_COLORS = [
  'bg-brand-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-sky-500',
];

function computeLanguageBreakdown(
  languages: Record<string, number>,
): Array<{ name: string; percentage: number }> {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  if (totalBytes === 0) {
    return [];
  }

  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6);
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
}

export function RepositorySummary({ repository }: RepositorySummaryProps) {
  const languageBreakdown = computeLanguageBreakdown(repository.languages);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <img
          src={repository.ownerAvatarUrl}
          alt={`${repository.owner} avatar`}
          className="h-14 w-14 flex-shrink-0 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h2 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
              {repository.name}
            </h2>
            <span className="text-sm text-slate-400 dark:text-slate-500">by</span>
            <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
              {repository.owner}
            </span>
          </div>

          {repository.description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {repository.description}
            </p>
          ) : (
            <p className="mt-1.5 text-sm italic text-slate-400 dark:text-slate-500">
              No description provided
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-center transition-colors duration-300 dark:bg-slate-800/60">
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatCompactNumber(repository.stars)}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Stars</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-center transition-colors duration-300 dark:bg-slate-800/60">
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatCompactNumber(repository.forks)}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Forks</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-center transition-colors duration-300 dark:bg-slate-800/60">
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatCompactNumber(repository.openIssues)}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Open Issues
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-center transition-colors duration-300 dark:bg-slate-800/60">
          <p className="truncate text-xl font-bold text-slate-900 dark:text-slate-100">
            {repository.primaryLanguage ?? '—'}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Primary Language
          </p>
        </div>
      </div>

      {languageBreakdown.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Languages
          </h3>

          <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {languageBreakdown.map((language, index) => (
              <div
                key={language.name}
                style={{ width: `${language.percentage}%` }}
                className={`h-full transition-all duration-500 ease-out ${
                  LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]
                }`}
                title={`${language.name}: ${language.percentage}%`}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {languageBreakdown.map((language, index) => (
              <div key={language.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]
                  }`}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language.name}
                </span>
                <span className="text-slate-400 dark:text-slate-500">{language.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {repository.topics.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {repository.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors duration-300 dark:bg-brand-500/10 dark:text-brand-300"
            >
              {topic}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
