import { CookieOptions, Response } from 'express';
import { env } from '../config/env';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    path: '/',
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.cookieName, token, {
    ...baseCookieOptions(),
    maxAge: SEVEN_DAYS_MS,
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(env.cookieName, baseCookieOptions());
}