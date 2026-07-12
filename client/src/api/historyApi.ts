import { axiosClient } from './axiosClient';

export interface HistoryEntry {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: unknown;
  analysis: {
    summary?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedHistoryResponse {
  items: HistoryEntry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SaveAnalysisHistoryPayload {
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: Record<string, unknown>;
  analysis: Record<string, unknown>;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export const HistoryService = {
  async saveAnalysisHistory(payload: SaveAnalysisHistoryPayload): Promise<HistoryEntry> {
    const response = await axiosClient.post<ApiSuccessResponse<HistoryEntry>>(
      '/history/save',
      payload,
    );
    return response.data.data;
  },

  async getHistory(page = 1, pageSize = 10): Promise<PaginatedHistoryResponse> {
    const response = await axiosClient.get<ApiSuccessResponse<PaginatedHistoryResponse>>(
      '/history',
      { params: { page, pageSize } },
    );
    return response.data.data;
  },

  async deleteHistoryEntry(id: string): Promise<void> {
    await axiosClient.delete(`/history/${id}`);
  },
};
