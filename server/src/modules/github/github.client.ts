import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DEFAULT_REQUEST_TIMEOUT_MS, GITHUB_API_BASE_URL } from './github.constants';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../config/logger';

const githubToken = process.env.GITHUB_TOKEN;

const client: AxiosInstance = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  timeout: DEFAULT_REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
  },
});

const MAX_RETRIES = 1;

export async function githubGet<T>(
  path: string,
  config?: AxiosRequestConfig,
  attempt = 0,
): Promise<AxiosResponse<T>> {
  try {
    return await client.get<T>(path, config);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw ApiError.notFound('GitHub resource not found');
      }

      if (status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
        throw new ApiError(429, 'GitHub API rate limit exceeded. Try again later.');
      }

      if (status === 401) {
        throw ApiError.unauthorized('Invalid or missing GitHub token');
      }

      const isRetryable = !status || status >= 500;
      if (isRetryable && attempt < MAX_RETRIES) {
        logger.warn('Retrying GitHub API request', { path, attempt: attempt + 1 });
        return githubGet<T>(path, config, attempt + 1);
      }
    }

    logger.error('GitHub API request failed', { path, error: (error as Error).message });
    throw ApiError.internal('Failed to communicate with GitHub API');
  }
}

export async function githubGetRaw(url: string): Promise<string | null> {
  try {
    const response = await axios.get<string>(url, {
      timeout: DEFAULT_REQUEST_TIMEOUT_MS,
      responseType: 'text',
    });
    return response.data;
  } catch {
    return null;
  }
}