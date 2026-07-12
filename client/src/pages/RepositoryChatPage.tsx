import { FormEvent, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AnalyzeButton } from '../components/repository/AnalyzeButton';
import { RepositoryChatWindow } from '../components/repository/RepositoryChatWindow';

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

export function RepositoryChatPage() {
  const [inputValue, setInputValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [activeRepositoryUrl, setActiveRepositoryUrl] = useState<string | null>(null);

  const validationError = touched ? validateRepositoryUrl(inputValue) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setTouched(true);

    const clientError = validateRepositoryUrl(inputValue);
    if (clientError) return;

    setActiveRepositoryUrl(inputValue.trim());
  }

  function handleChangeRepository(): void {
    setActiveRepositoryUrl(null);
    setInputValue('');
    setTouched(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Repository Chat
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pick a public GitHub repository and ask questions about it directly.
          </p>
        </div>

        {!activeRepositoryUrl ? (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <label
              htmlFor="chat-repository-url"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              GitHub repository URL
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="chat-repository-url"
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="https://github.com/owner/repository"
                aria-invalid={Boolean(validationError)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                  validationError
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-300 focus:ring-brand-500 dark:border-slate-700'
                }`}
              />
              <AnalyzeButton className="sm:w-auto">Start Chat</AnalyzeButton>
            </div>

            {validationError ? (
              <p className="mt-2 text-xs font-medium text-red-500">{validationError}</p>
            ) : null}
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={handleChangeRepository}
              className="self-start text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              &larr; Chat about a different repository
            </button>

            <RepositoryChatWindow
              repositoryUrl={activeRepositoryUrl}
              repositoryLabel={activeRepositoryUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            />
          </>
        )}
      </main>
    </div>
  );
}