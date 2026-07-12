import axios from 'axios';
import { logger } from '../../config/logger';
import { ApiError } from '../../utils/ApiError';
import { OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT_MS } from '../ai/ai.constants';

interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream: boolean;
  options?: { temperature?: number };
}

interface OllamaChatResponse {
  message: { role: string; content: string };
  done: boolean;
}

export async function generateChatCompletion(messages: OllamaChatMessage[]): Promise<string> {
  const payload: OllamaChatRequest = {
    model: OLLAMA_MODEL,
    messages,
    stream: false,
    options: { temperature: 0.3 },
  };

  try {
    const response = await axios.post<OllamaChatResponse>(
      `${OLLAMA_BASE_URL}/api/chat`,
      payload,
      { timeout: OLLAMA_TIMEOUT_MS },
    );

    return response.data.message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw ApiError.internal(
          'Could not connect to the local Ollama server. Make sure Ollama is running (ollama serve) and the model is pulled.',
        );
      }
      if (error.response?.status === 404) {
        throw ApiError.internal(
          `Model "${OLLAMA_MODEL}" was not found. Run: ollama pull ${OLLAMA_MODEL}`,
        );
      }
    }

    logger.error('Ollama chat request failed', { error: (error as Error).message });
    throw ApiError.internal('Chat failed while communicating with the local model');
  }
}