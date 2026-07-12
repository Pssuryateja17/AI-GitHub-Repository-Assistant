import { useCallback, useMemo, useState } from 'react';
import { RepositoryService } from '../api/githubApi';
import { AnalysisResponse, LoadingState } from '../types/github';
import { extractErrorMessage } from '../utils/extractErrorMessage';

interface UseRepositoryAnalysisResult {
  data: AnalysisResponse | null;
  status: LoadingState;
  error: string | null;
  isLoading: boolean;
  analyze: (repositoryUrl: string) => Promise<void>;
  reset: () => void;
}

export function useRepositoryAnalysis(): UseRepositoryAnalysisResult {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (repositoryUrl: string): Promise<void> => {
    setStatus('loading');
    setError(null);

    try {
      const result = await RepositoryService.analyzeRepository(repositoryUrl);
      setData(result);
      setStatus('success');
    } catch (caughtError) {
      setData(null);
      setError(extractErrorMessage(caughtError));
      setStatus('error');
    }
  }, []);

  const reset = useCallback((): void => {
    setData(null);
    setStatus('idle');
    setError(null);
  }, []);

  return useMemo(
    () => ({
      data,
      status,
      error,
      isLoading: status === 'loading',
      analyze,
      reset,
    }),
    [data, status, error, analyze, reset],
  );
}
