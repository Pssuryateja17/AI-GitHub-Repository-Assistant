import { axiosClient } from './axiosClient';
import { AnalysisResponse } from '../types/github';

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export const RepositoryService = {
  async analyzeRepository(repositoryUrl: string): Promise<AnalysisResponse> {
    const response = await axiosClient.post<ApiSuccessResponse<AnalysisResponse>>(
      '/github/analyze',
      { repositoryUrl },
    );
    return response.data.data;
  },
};