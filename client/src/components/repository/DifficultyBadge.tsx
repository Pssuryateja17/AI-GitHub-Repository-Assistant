import { AIAnalysis } from '../../types/github';

interface DifficultyBadgeProps {
  difficulty: AIAnalysis['difficulty'];
  className?: string;
}

const DIFFICULTY_STYLES: Record<AIAnalysis['difficulty'], string> = {
  Beginner:
    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
  Intermediate:
    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
  Advanced:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
};

const DIFFICULTY_DOT_STYLES: Record<AIAnalysis['difficulty'], string> = {
  Beginner: 'bg-green-500 dark:bg-green-400',
  Intermediate: 'bg-amber-500 dark:bg-amber-400',
  Advanced: 'bg-red-500 dark:bg-red-400',
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-300 ${DIFFICULTY_STYLES[difficulty]} ${
        className ?? ''
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_DOT_STYLES[difficulty]}`} />
      {difficulty}
    </span>
  );
}
