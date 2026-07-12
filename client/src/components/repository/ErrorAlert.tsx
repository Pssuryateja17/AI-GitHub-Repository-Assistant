import { useEffect, useState } from 'react';
import { APIError } from '../../types/github';

interface ErrorAlertProps {
  error: string | APIError | null;
  onDismiss?: () => void;
}

function resolveMessage(error: string | APIError): string {
  if (typeof error === 'string') {
    return error;
  }
  return error.message ?? 'Something went wrong. Please try again.';
}

function resolveFieldErrors(error: string | APIError): Array<{ path: string; message: string }> {
  if (typeof error === 'string') {
    return [];
  }
  return error.errors ?? [];
}

export function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (error) {
      setIsDismissed(false);
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setIsVisible(false);
    return undefined;
  }, [error]);

  if (!error || isDismissed) {
    return null;
  }

  function handleDismiss(): void {
    setIsVisible(false);
    window.setTimeout(() => {
      setIsDismissed(true);
      onDismiss?.();
    }, 200);
  }

  const message = resolveMessage(error);
  const fieldErrors = resolveFieldErrors(error);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition-all duration-200 ease-out dark:border-red-900/50 dark:bg-red-950/40 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16Zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5ZM10 15a1 1 0 100-2 1 1 0 000 2Z"
          clipRule="evenodd"
        />
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-red-700 dark:text-red-300">{message}</p>

        {fieldErrors.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {fieldErrors.map((fieldError) => (
              <li
                key={`${fieldError.path}-${fieldError.message}`}
                className="text-xs text-red-600 dark:text-red-400"
              >
                <span className="font-semibold">{fieldError.path}:</span> {fieldError.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss error"
        className="flex-shrink-0 rounded-md p-1 text-red-500 transition-colors duration-150 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}