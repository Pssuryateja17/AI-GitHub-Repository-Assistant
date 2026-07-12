import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { analyzeRepositoryWithAI } from '../ai/ai.service';
import { recordAnalysisHistory } from '../history/history.service';
import { AnalyzeRepositoryResponseDto } from './github.dto';
import { buildRepositoryContext } from './github.service';

export const analyzeRepository = asyncHandler(async (req: Request, res: Response) => {
  const { repositoryUrl } = req.body as { repositoryUrl: string };

  const context = await buildRepositoryContext(repositoryUrl);
  const analysis = await analyzeRepositoryWithAI(context);

  const responseBody: AnalyzeRepositoryResponseDto = {
    repository: context.metadata,
    readme: context.readme,
    analysis,
  };

  const userId = (req as any).userId as string | undefined;

  if (userId) {
    try {
      await recordAnalysisHistory({
        userId,
        repositoryFullName: context.metadata.fullName,
        repositoryUrl: context.metadata.url,
        metadata: context.metadata as unknown as Prisma.InputJsonValue,
        analysis: analysis as unknown as Prisma.InputJsonValue,
      });
    } catch (error) {
      // History is supplementary - a failure to record it must not affect the
      // analyze response the client is waiting on.
      logger.error('Failed to record analysis history', {
        repositoryFullName: context.metadata.fullName,
        error: (error as Error).message,
      });
    }
  }

  sendSuccess(res, 200, 'Repository analyzed successfully', responseBody);
});
