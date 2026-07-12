import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/token';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const cookieToken = req.cookies?.[env.cookieName] as string | undefined;
    const headerToken = extractBearerToken(req.headers.authorization);
    const token = cookieToken || headerToken;

    if (!token) {
      throw ApiError.unauthorized('Authentication token missing');
    }

    const payload = verifyToken(token);

    // FIXED LINE (TypeScript safe bypass)
    (req as any).userId = payload.userId;

    next();
  } catch (_error) {
    next(ApiError.unauthorized('Invalid or expired authentication token'));
  }
}

function extractBearerToken(headerValue: string | undefined): string | undefined {
  if (!headerValue) return undefined;

  const [scheme, token] = headerValue.split(' ');
  if (scheme !== 'Bearer' || !token) return undefined;

  return token;
}