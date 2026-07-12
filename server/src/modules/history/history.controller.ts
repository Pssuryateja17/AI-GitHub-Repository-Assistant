import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  deleteAnalysisHistoryEntry,
  getAnalysisHistoryForUser,
  recordAnalysisHistory,
} from './history.service';
import { SaveAnalysisHistoryInput } from './history.validator';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function requireUserId(req: Request): string {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw ApiError.unauthorized();
  }
  return userId;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const saveAnalysisHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const { repositoryFullName, repositoryUrl, metadata, analysis } =
    req.body as SaveAnalysisHistoryInput;

  const entry = await recordAnalysisHistory({
    userId,
    repositoryFullName,
    repositoryUrl,
    metadata: metadata as Prisma.InputJsonValue,
    analysis: analysis as Prisma.InputJsonValue,
  });

  sendSuccess(res, 201, 'Analysis saved to history', entry);
});

export const listAnalysisHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
  const pageSize = parsePositiveInt(req.query.pageSize, DEFAULT_PAGE_SIZE);

  const result = await getAnalysisHistoryForUser(userId, page, pageSize);

  sendSuccess(res, 200, 'History fetched successfully', result);
});

export const deleteHistoryEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const { id } = req.params;

  await deleteAnalysisHistoryEntry(id, userId);

  sendSuccess(res, 200, 'History entry deleted successfully', null);
});
