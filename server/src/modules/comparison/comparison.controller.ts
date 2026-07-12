import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { compareRepositories } from './comparison.service';

export const compareRepositoriesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { repositoryAUrl, repositoryBUrl } = req.body as {
    repositoryAUrl: string;
    repositoryBUrl: string;
  };

  if (repositoryAUrl.trim().toLowerCase() === repositoryBUrl.trim().toLowerCase()) {
    throw ApiError.badRequest('repositoryAUrl and repositoryBUrl must be different repositories');
  }

  const result = await compareRepositories(repositoryAUrl, repositoryBUrl);

  sendSuccess(res, 200, 'Repositories compared successfully', result);
});
