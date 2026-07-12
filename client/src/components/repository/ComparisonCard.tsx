import { useEffect, useState } from 'react';

interface ComparisonCardProps {
  repositoryAName: string;
  repositoryBName: string;
  summaryA: string;
  summaryB: string;
  advantagesA: string[];
  advantagesB: string[];
  overallRecommendation: string;
}

export function ComparisonCard({
  repositoryAName,
  repositoryBName,
  summaryA,
  summaryB,
  advantagesA,
  advantagesB,
  overallRecommendation,
}: ComparisonCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out dark:border-slate-700 dark:bg-slate-900 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Comparison</h2>

      <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/60 p-4 transition-colors duration-300 dark:border-brand-800 dark:bg-brand-500/10">
        <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
          {overallRecommendation}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          style={{ transitionDelay: '80ms' }}
          className={`rounded-xl border border-slate-200 p-4 transition-all duration-500 ease-out dark:border-slate-700 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
          }`}
        >
          <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
            {repositoryAName}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {summaryA}
          </p>

          {advantagesA.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {advantagesA.map((advantage) => (
                <li
                  key={advantage}
                  className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400"
                >
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-brand-500" />
                  {advantage}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          style={{ transitionDelay: '140ms' }}
          className={`rounded-xl border border-slate-200 p-4 transition-all duration-500 ease-out dark:border-slate-700 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
          }`}
        >
          <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
            {repositoryBName}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {summaryB}
          </p>

          {advantagesB.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {advantagesB.map((advantage) => (
                <li
                  key={advantage}
                  className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400"
                >
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-violet-500" />
                  {advantage}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
