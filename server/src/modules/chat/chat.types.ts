export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface AskChatQuestionInput {
  repositoryId?: string;
  repositoryUrl?: string;
  question: string;
}

export interface ChatAnswerResult {
  answer: string;
  repositoryFullName: string;
  history: ChatMessage[];
}