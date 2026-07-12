import { Response } from 'express';

interface ApiSuccessPayload<T> {
  success: true;
  message: string;
  data: T;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): Response<ApiSuccessPayload<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}