import { useEffect, useState } from 'react';
import { AIAnalysis } from '../../types/github';

interface AnalysisCardProps {
  analysis: AIAnalysis;
}

const DIFFICULTY_STYLES: Record<AIAnalysis['difficulty'], string> = {
  Beginner:
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800',
  Intermediate:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Advanced:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
};

export function AnalysisCard({ analysis }: AnalysisCardProps) {
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Analysis</h2>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${DIFFICULTY_STYLES[analysis.difficulty]}`}
        >
          {analysis.difficulty}
        </span>
      </div>

      <section className="mt-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Summary</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {analysis.summary}
        </p>
      </section>

      {analysis.technologies.length > 0 ? (
        <section className="mt-5">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Technologies
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.technologies.map((technology, index) => (
              <span
                key={technology}
                style={{ transitionDelay: `${index * 40}ms` }}
                className={`rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-all duration-300 ease-out dark:bg-brand-500/10 dark:text-brand-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                {technology}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {analysis.improvements.length > 0 ? (
        <section className="mt-5">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Recommendations
          </h3>
          <ul className="mt-2 space-y-2">
            {analysis.improvements.map((recommendation) => (
              <li
                key={recommendation}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
