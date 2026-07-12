interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({
  size = 'md',
  label,
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className ?? ''}`}>
      <span
        role="status"
        aria-label={label ?? 'Loading'}
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-500 ${SIZE_CLASSES[size]}`}
      />
      {label ? (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      ) : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        {spinner}
      </div>
    );
  }

  return spinner;
}