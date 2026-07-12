import { useEffect, useState } from 'react';

interface RoadmapCardProps {
  roadmap: string[];
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleStep(index: number): void {
    setCompletedSteps((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  const progressPercentage =
    roadmap.length > 0 ? Math.round((completedSteps.size / roadmap.length) * 100) : 0;

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out dark:border-slate-700 dark:bg-slate-900 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Learning Roadmap</h2>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {completedSteps.size} / {roadmap.length} completed
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {roadmap.length === 0 ? (
        <p className="mt-5 text-sm italic text-slate-400 dark:text-slate-500">
          No roadmap steps were generated for this repository.
        </p>
      ) : (
        <ol className="mt-5 flex flex-col">
          {roadmap.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isLast = index === roadmap.length - 1;

            return (
              <li
                key={step}
                style={{ transitionDelay: `${index * 60}ms` }}
                className={`relative flex gap-4 pb-6 transition-all duration-300 ease-out last:pb-0 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                }`}
              >
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={`absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5 transition-colors duration-300 ${
                      isCompleted ? 'bg-brand-400 dark:bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ) : null}

                <button
                  type="button"
                  onClick={() => toggleStep(index)}
                  aria-pressed={isCompleted}
                  aria-label={`Mark step ${index + 1} as ${isCompleted ? 'incomplete' : 'complete'}`}
                  className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-slate-300 bg-white text-slate-500 hover:border-brand-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>

                <p
                  className={`mt-1 text-sm leading-relaxed transition-colors duration-200 ${
                    isCompleted
                      ? 'text-slate-400 line-through dark:text-slate-600'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {step}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
