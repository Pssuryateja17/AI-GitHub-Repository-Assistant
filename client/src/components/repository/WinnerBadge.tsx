export type ComparisonWinner = 'A' | 'B' | 'tie';

interface WinnerBadgeProps {
  winner: ComparisonWinner;
  labelA?: string;
  labelB?: string;
}

const WINNER_STYLES: Record<ComparisonWinner, string> = {
  A: 'bg-brand-100 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-800',
  B: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-800',
  tie: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

export function WinnerBadge({ winner, labelA = 'Repo A', labelB = 'Repo B' }: WinnerBadgeProps) {
  const text = winner === 'tie' ? 'Tie' : winner === 'A' ? labelA : labelB;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 ease-out ${WINNER_STYLES[winner]}`}
    >
      {winner !== 'tie' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-3 w-3"
        >
          <path d="M10 2a1 1 0 01.894.553l1.382 2.764 3.05.443a1 1 0 01.554 1.706l-2.207 2.152.521 3.037a1 1 0 01-1.451 1.054L10 12.347l-2.743 1.362a1 1 0 01-1.451-1.054l.521-3.037-2.207-2.152a1 1 0 01.554-1.706l3.05-.443L9.106 2.553A1 1 0 0110 2Z" />
        </svg>
      ) : null}
      {text}
    </span>
  );
}
