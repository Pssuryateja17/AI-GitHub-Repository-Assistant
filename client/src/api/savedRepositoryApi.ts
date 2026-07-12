import { axiosClient } from './axiosClient';

export interface SavedRepositoryEntry {
  id: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveRepositoryPayload {
  repositoryFullName: string;
  repositoryUrl: string;
  note?: string;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export const SavedRepositoryService = {
  async saveRepository(payload: SaveRepositoryPayload): Promise<SavedRepositoryEntry> {
    const response = await axiosClient.post<ApiSuccessResponse<SavedRepositoryEntry>>(
      '/saved',
      payload,
    );
    return response.data.data;
  },

  async getSavedRepositories(): Promise<SavedRepositoryEntry[]> {
    const response =
      await axiosClient.get<ApiSuccessResponse<SavedRepositoryEntry[]>>('/saved');
    return response.data.data;
  },

  async unsaveRepository(id: string): Promise<void> {
    await axiosClient.delete(`/saved/${id}`);
  },
};
