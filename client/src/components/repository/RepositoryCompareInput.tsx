import { FormEvent, useState } from 'react';
import { AnalyzeButton } from './AnalyzeButton';

interface RepositoryCompareInputProps {
  onCompare: (repositoryAUrl: string, repositoryBUrl: string) => void | Promise<void>;
  isLoading: boolean;
}

const GITHUB_URL_PATTERN =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38})\/([a-zA-Z0-9._-]+?)(?:\.git)?\/?$/;

function validateUrl(value: string, label: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return `${label} is required.`;
  }
  if (!GITHUB_URL_PATTERN.test(trimmed)) {
    return `${label} must be a valid public GitHub repository URL.`;
  }
  return null;
}

export function RepositoryCompareInput({ onCompare, isLoading }: RepositoryCompareInputProps) {
  const [repositoryAUrl, setRepositoryAUrl] = useState('');
  const [repositoryBUrl, setRepositoryBUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const errorA = touched ? validateUrl(repositoryAUrl, 'Repository A URL') : null;
  const errorB = touched ? validateUrl(repositoryBUrl, 'Repository B URL') : null;
  const duplicateError =
    touched && !errorA && !errorB && repositoryAUrl.trim().toLowerCase() === repositoryBUrl.trim().toLowerCase()
      ? 'Repository A and Repository B must be different.'
      : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setTouched(true);

    const clientErrorA = validateUrl(repositoryAUrl, 'Repository A URL');
    const clientErrorB = validateUrl(repositoryBUrl, 'Repository B URL');

    if (clientErrorA || clientErrorB) {
      return;
    }

    if (repositoryAUrl.trim().toLowerCase() === repositoryBUrl.trim().toLowerCase()) {
      return;
    }

    await onCompare(repositoryAUrl.trim(), repositoryBUrl.trim());
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="repository-a-url"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Repository A
          </label>
          <input
            id="repository-a-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={repositoryAUrl}
            onChange={(event) => setRepositoryAUrl(event.target.value)}
            onBlur={() => setTouched(true)}
            disabled={isLoading}
            placeholder="https://github.com/owner/repository-a"
            aria-invalid={Boolean(errorA)}
            className={`rounded-lg border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              errorA
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 focus:ring-brand-500 dark:border-slate-700'
            }`}
          />
          {errorA ? <p className="text-xs font-medium text-red-500">{errorA}</p> : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="repository-b-url"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Repository B
          </label>
          <input
            id="repository-b-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={repositoryBUrl}
            onChange={(event) => setRepositoryBUrl(event.target.value)}
            onBlur={() => setTouched(true)}
            disabled={isLoading}
            placeholder="https://github.com/owner/repository-b"
            aria-invalid={Boolean(errorB)}
            className={`rounded-lg border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              errorB
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 focus:ring-brand-500 dark:border-slate-700'
            }`}
          />
          {errorB ? <p className="text-xs font-medium text-red-500">{errorB}</p> : null}
        </div>
      </div>

      {duplicateError ? (
        <p className="mt-3 text-xs font-medium text-red-500">{duplicateError}</p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <AnalyzeButton isLoading={isLoading} loadingLabel="Comparing..." className="sm:w-auto">
          Compare Repositories
        </AnalyzeButton>
      </div>
    </form>
  );
}
