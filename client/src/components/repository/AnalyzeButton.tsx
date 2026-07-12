import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AnalyzeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

export function AnalyzeButton({
  isLoading = false,
  loadingLabel = 'Analyzing...',
  children,
  disabled,
  className,
  type = 'submit',
  ...rest
}: AnalyzeButtonProps) {
  const isDisabled = Boolean(disabled) || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-600 disabled:hover:shadow-sm dark:bg-brand-600 dark:hover:bg-brand-700 sm:w-auto w-full ${
        className ?? ''
      }`}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <span className="transition-transform duration-150">{children}</span>
      )}
    </button>
  );
}