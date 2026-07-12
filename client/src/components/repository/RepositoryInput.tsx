import { FormEvent, useState } from 'react';
import { useRepositoryAnalysis } from '../../hooks/useRepositoryAnalysis';

const GITHUB_URL_PATTERN =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38})\/([a-zA-Z0-9._-]+?)(?:\.git)?\/?$/;

function validateRepositoryUrl(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Please enter a GitHub repository URL.';
  }

  if (!GITHUB_URL_PATTERN.test(trimmed)) {
    return 'Enter a valid public repository URL, e.g. https://github.com/facebook/react';
  }

  return null;
}

export function RepositoryInput() {
  const { analyze, isLoading, status, error, reset } = useRepositoryAnalysis();
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const validationError = touched ? validateRepositoryUrl(value) : null;

  function handleChange(nextValue: string): void {
    setValue(nextValue);
    if (status === 'error' || status === 'success') {
      reset();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setTouched(true);

    const clientError = validateRepositoryUrl(value);
    if (clientError) {
      return;
    }

    await analyze(value.trim());
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900"
    >
      <label
        htmlFor="repository-url"
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        GitHub repository URL
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55C20.21 21.38 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
          </svg>
          <input
            id="repository-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={() => setTouched(true)}
            disabled={isLoading}
            placeholder="https://github.com/owner/repository"
            aria-invalid={Boolean(validationError)}
            aria-describedby="repository-url-error"
            className={`w-full rounded-lg border py-3 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              validationError
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 focus:ring-brand-500 dark:border-slate-700'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

      <div
        id="repository-url-error"
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: validationError || error ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          {validationError ? (
            <p className="mt-2 text-xs font-medium text-red-500">{validationError}</p>
          ) : error ? (
            <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}