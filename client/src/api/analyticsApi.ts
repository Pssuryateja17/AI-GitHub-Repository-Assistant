import { axiosClient } from './axiosClient';

export interface LanguageDistributionEntry {
  language: string;
  count: number;
}

export interface DifficultyDistributionEntry {
  difficulty: string;
  count: number;
}

export interface AnalyticsOverview {
  totalAnalyses: number;
  totalSaved: number;
  totalComparisons: number;
  totalComparisonsNote: string;
  languageDistribution: LanguageDistributionEntry[];
  difficultyDistribution: DifficultyDistributionEntry[];
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export const AnalyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const response =
      await axiosClient.get<ApiSuccessResponse<AnalyticsOverview>>('/analytics/overview');
    return response.data.data;
  },
};