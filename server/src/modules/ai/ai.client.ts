import axios from 'axios';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../config/logger';
import { OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT_MS } from './ai.constants';
import { OllamaGenerateRequest, OllamaGenerateResponse } from './ai.types';

export async function generateCompletion(system: string, prompt: string): Promise<string> {
  const payload: OllamaGenerateRequest = {
    model: OLLAMA_MODEL,
    prompt,
    system,
    stream: false,
    format: 'json',
    options: {
      temperature: 0.2,
    },
  };

  try {
    const response = await axios.post<OllamaGenerateResponse>(
      `${OLLAMA_BASE_URL}/api/generate`,
      payload,
      { timeout: OLLAMA_TIMEOUT_MS },
    );

    return response.data.response;
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

    logger.error('Ollama request failed', { error: (error as Error).message });
    throw ApiError.internal('AI analysis failed while communicating with the local model');
  }
}