import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from '../../utils/ApiError';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  listSavedRepositoriesForUser,
  saveRepositoryForUser,
  unsaveRepositoryForUser,
} from './savedRepositories.service';

export const saveRepositorySchema = z.object({
  body: z.object({
    repositoryFullName: z
      .string({ required_error: 'repositoryFullName is required' })
      .trim()
      .min(1, 'repositoryFullName is required'),
    repositoryUrl: z
      .string({ required_error: 'repositoryUrl is required' })
      .trim()
      .url('repositoryUrl must be a valid URL'),
    note: z.string().trim().max(500, 'note must be at most 500 characters').optional(),
  }),
});

export const savedRepositoryIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }).uuid('id must be a valid UUID'),
  }),
});

type SaveRepositoryInput = z.infer<typeof saveRepositorySchema>['body'];

function requireUserId(req: Request): string {
  const userId = (req as any).userId as string;

  if (!userId) {
    throw ApiError.unauthorized();
  }

  return userId;
}

export const saveRepository = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const { repositoryFullName, repositoryUrl, note } = req.body as SaveRepositoryInput;

  const entry = await saveRepositoryForUser({ userId, repositoryFullName, repositoryUrl, note });

  sendSuccess(res, 201, 'Repository saved successfully', entry);
});

export const listSavedRepositories = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);

  const entries = await listSavedRepositoriesForUser(userId);

  sendSuccess(res, 200, 'Saved repositories fetched successfully', entries);
});

export const unsaveRepository = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const { id } = req.params;

  await unsaveRepositoryForUser(id, userId);

  sendSuccess(res, 200, 'Repository removed from saved list', null);
});
