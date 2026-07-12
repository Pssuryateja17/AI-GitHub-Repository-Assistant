import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error(err.message, { stack: err.stack });
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
    return;
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  res.status(500).json({
    success: false,
    message: env.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
}