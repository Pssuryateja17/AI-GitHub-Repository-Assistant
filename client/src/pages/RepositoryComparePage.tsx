import { useState } from 'react';
import { axiosClient } from '../api/axiosClient';
import { Navbar } from '../components/Navbar';
import { ComparisonCard } from '../components/repository/ComparisonCard';
import { ComparisonTable } from '../components/repository/ComparisonTable';
import { ErrorAlert } from '../components/repository/ErrorAlert';
import { RepositoryCompareInput } from '../components/repository/RepositoryCompareInput';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { extractErrorMessage } from '../utils/extractErrorMessage';

interface ComparisonMetadata {
  fullName: string;
}

interface ComparisonAnalysis {
  summary: string;
  difficulty: string;
  advantages: string[];
}

interface ComparisonSide {
  metadata: ComparisonMetadata;
  analysis: ComparisonAnalysis;
}

interface NumericMetric {
  repositoryA: number;
  repositoryB: number;
  winner: 'A' | 'B' | 'tie';
}

interface CompareApiResponse {
  repositoryA: ComparisonSide;
  repositoryB: ComparisonSide;
  comparison: {
    stars: NumericMetric;
    forks: NumericMetric;
    openIssues: NumericMetric;
    technologies: {
      shared: string[];
      uniqueToA: string[];
      uniqueToB: string[];
    };
    difficulty: {
      repositoryA: string;
      repositoryB: string;
      verdict: string;
    };
    learningCurve: {
      repositoryA: string;
      repositoryB: string;
      verdict: string;
    };
    summary: {
      repositoryA: string;
      repositoryB: string;
    };
    advantages: {
      repositoryA: string[];
      repositoryB: string[];
    };
    overallRecommendation: string;
  };
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

type PageStatus = 'idle' | 'loading' | 'success' | 'error';

export function RepositoryComparePage() {
  const [status, setStatus] = useState<PageStatus>('idle');
  const [result, setResult] = useState<CompareApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCompare(repositoryAUrl: string, repositoryBUrl: string): Promise<void> {
    setStatus('loading');
    setError(null);

    try {
      const response = await axiosClient.post<ApiSuccessResponse<CompareApiResponse>>(
        '/compare',
        { repositoryAUrl, repositoryBUrl },
      );
      setResult(response.data.data);
      setStatus('success');
    } catch (caughtError) {
      setResult(null);
      setError(extractErrorMessage(caughtError));
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Compare Repositories
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Paste two public GitHub repository URLs to compare their popularity, technologies,
            difficulty, and learning curve side by side.
          </p>
        </div>

        <RepositoryCompareInput onCompare={handleCompare} isLoading={status === 'loading'} />

        {status === 'loading' ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/40">
            <LoadingSpinner size="lg" label="Analyzing both repositories..." />
          </div>
        ) : null}

        {status === 'error' ? (
          <ErrorAlert error={error} onDismiss={() => setStatus('idle')} />
        ) : null}

        {status === 'success' && result ? (
          <>
            <ComparisonTable
              repositoryAName={result.repositoryA.metadata.fullName}
              repositoryBName={result.repositoryB.metadata.fullName}
              stars={result.comparison.stars}
              forks={result.comparison.forks}
              openIssues={result.comparison.openIssues}
              technologies={result.comparison.technologies}
              difficulty={result.comparison.difficulty}
              learningCurve={result.comparison.learningCurve}
            />

            <ComparisonCard
              repositoryAName={result.repositoryA.metadata.fullName}
              repositoryBName={result.repositoryB.metadata.fullName}
              summaryA={result.comparison.summary.repositoryA}
              summaryB={result.comparison.summary.repositoryB}
              advantagesA={result.comparison.advantages.repositoryA}
              advantagesB={result.comparison.advantages.repositoryB}
              overallRecommendation={result.comparison.overallRecommendation}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
