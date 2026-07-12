import { useEffect, useState } from 'react';

interface ProsConsCardProps {
  advantages: string[];
  disadvantages: string[];
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500 dark:text-red-400"
    >
      <path
        fillRule="evenodd"
        d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ListColumn({
  title,
  items,
  icon,
  isVisible,
  delayOffsetMs,
  accentClassName,
}: {
  title: string;
  items: string[];
  icon: 'check' | 'x';
  isVisible: boolean;
  delayOffsetMs: number;
  accentClassName: string;
}) {
  return (
    <div
      className={`flex-1 rounded-xl border p-4 transition-colors duration-300 ${accentClassName}`}
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>

      {items.length > 0 ? (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li
              key={item}
              style={{ transitionDelay: `${delayOffsetMs + index * 60}ms` }}
              className={`flex items-start gap-2 text-sm text-slate-700 transition-all duration-300 ease-out dark:text-slate-300 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
              }`}
            >
              {icon === 'check' ? <CheckIcon /> : <XIcon />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-slate-400 dark:text-slate-500">
          None identified by the AI analysis.
        </p>
      )}
    </div>
  );
}

export function ProsConsCard({ advantages, disadvantages }: ProsConsCardProps) {
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
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        Advantages &amp; Disadvantages
      </h2>

      <div className="flex flex-col gap-4 sm:flex-row">
        <ListColumn
          title="Advantages"
          items={advantages}
          icon="check"
          isVisible={isVisible}
          delayOffsetMs={80}
          accentClassName="border-green-200 bg-green-50/60 dark:border-green-900/40 dark:bg-green-900/10"
        />
        <ListColumn
          title="Disadvantages"
          items={disadvantages}
          icon="x"
          isVisible={isVisible}
          delayOffsetMs={140}
          accentClassName="border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-900/10"
        />
      </div>
    </div>
  );
}
