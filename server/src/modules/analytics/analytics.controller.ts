import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { getAnalyticsOverviewForUser } from './analytics.service';

function requireUserId(req: Request): string {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw ApiError.unauthorized();
  }
  return userId;
}

export const getAnalyticsOverview = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);

  const overview = await getAnalyticsOverviewForUser(userId);

  sendSuccess(res, 200, 'Analytics overview fetched successfully', overview);
});