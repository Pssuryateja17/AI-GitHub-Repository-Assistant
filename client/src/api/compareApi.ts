import { axiosClient } from './axiosClient';

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

export interface CompareRepositoriesResponse {
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

export const CompareService = {
  async compareRepositories(
    repositoryAUrl: string,
    repositoryBUrl: string,
  ): Promise<CompareRepositoriesResponse> {
    const response = await axiosClient.post<ApiSuccessResponse<CompareRepositoriesResponse>>(
      '/compare',
      { repositoryAUrl, repositoryBUrl },
    );
    return response.data.data;
  },
};
