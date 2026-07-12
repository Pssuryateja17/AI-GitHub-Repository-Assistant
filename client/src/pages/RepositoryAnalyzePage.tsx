import { FormEvent, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AnalyzeButton } from '../components/repository/AnalyzeButton';
import { AnalysisSection } from '../components/repository/AnalysisSection';
import { FolderStructure } from '../components/repository/FolderStructure';
import { InstallationGuide } from '../components/repository/InstallationGuide';
import { ProsConsCard } from '../components/repository/ProsConsCard';
import { RepositoryChatWindow } from '../components/repository/RepositoryChatWindow';
import { RoadmapCard } from '../components/repository/RoadmapCard';
import { useRepositoryAnalysis } from '../hooks/useRepositoryAnalysis';

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

export function RepositoryAnalyzePage() {
  const { data, status, error, isLoading, analyze, reset } = useRepositoryAnalysis();
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const validationError = touched ? validateRepositoryUrl(repositoryUrl) : null;

  function handleChange(nextValue: string): void {
    setRepositoryUrl(nextValue);
    if (status === 'error' || status === 'success') {
      reset();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setTouched(true);

    const clientError = validateRepositoryUrl(repositoryUrl);
    if (clientError) {
      return;
    }

    await analyze(repositoryUrl.trim());
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Repository Analyzer
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Paste a public GitHub repository URL to get an AI-generated breakdown of its purpose,
            architecture, and learning path.
          </p>
        </div>

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
            <input
              id="repository-url"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={repositoryUrl}
              onChange={(event) => handleChange(event.target.value)}
              onBlur={() => setTouched(true)}
              disabled={isLoading}
              placeholder="https://github.com/owner/repository"
              aria-invalid={Boolean(validationError)}
              aria-describedby="repository-url-error"
              className={`flex-1 rounded-lg border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                validationError
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 focus:ring-brand-500 dark:border-slate-700'
              }`}
            />

            <AnalyzeButton isLoading={isLoading} className="sm:w-auto">
              Analyze
            </AnalyzeButton>
          </div>

          {validationError ? (
            <p id="repository-url-error" className="mt-2 text-xs font-medium text-red-500">
              {validationError}
            </p>
          ) : null}
        </form>

        <AnalysisSection status={status} data={data} error={error} onDismissError={reset} />

        {status === 'success' && data ? (
          <>
            <InstallationGuide installation={data.analysis.installation} />
            <FolderStructure folderStructure={data.analysis.folderStructure} />
            <ProsConsCard
              advantages={data.analysis.advantages}
              disadvantages={data.analysis.disadvantages}
            />
            <RoadmapCard roadmap={data.analysis.roadmap} />
            <RepositoryChatWindow
              repositoryUrl={data.repository.url}
              repositoryLabel={data.repository.fullName}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}