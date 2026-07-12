import axios from 'axios';
import { ApiErrorResponse } from '../types/auth';

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? 'Something went wrong. Please try again.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}