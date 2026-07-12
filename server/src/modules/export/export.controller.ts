import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { generateExport } from './export.service';
import { ExportFormat } from './export.types';

function requireUserId(req: Request): string {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw ApiError.unauthorized();
  }
  return userId;
}

export const exportAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const format = req.params.format as ExportFormat;
  const repositoryId = req.query.repositoryId as string | undefined;
  const repositoryUrl = req.query.repositoryUrl as string | undefined;

  if (!repositoryId && !repositoryUrl) {
    throw ApiError.badRequest('Either repositoryId or repositoryUrl is required');
  }

  const result = await generateExport(userId, { repositoryId, repositoryUrl, format });

  res.setHeader('Content-Type', result.contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
  res.setHeader('Content-Length', result.buffer.length);
  res.status(200).send(result.buffer);
});