import { axiosClient } from './axiosClient';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface AskChatQuestionPayload {
  repositoryId?: string;
  repositoryUrl?: string;
  question: string;
}

export interface ChatAnswerResponse {
  answer: string;
  repositoryFullName: string;
  history: ChatMessage[];
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export const ChatService = {
  async askQuestion(payload: AskChatQuestionPayload): Promise<ChatAnswerResponse> {
    const response = await axiosClient.post<ApiSuccessResponse<ChatAnswerResponse>>(
      '/chat',
      payload,
    );
    return response.data.data;
  },
};