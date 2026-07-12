import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { clearAuthCookie, setAuthCookie } from '../utils/cookie';
import { ApiError } from '../utils/ApiError';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.registerUser(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, 201, 'Account created successfully', { user, token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.loginUser(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, 200, 'Logged in successfully', { user, token });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  sendSuccess(res, 200, 'Logged out successfully', null);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if (!userId) {
    throw ApiError.unauthorized();
  }

  const user = await authService.getCurrentUser(userId);

  sendSuccess(res, 200, 'Current user fetched successfully', { user });
});