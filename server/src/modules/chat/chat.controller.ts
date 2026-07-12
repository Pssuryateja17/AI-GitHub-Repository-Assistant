import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { askChatQuestion } from './chat.service';
import { AskChatQuestionBody } from './chat.validator';

function requireUserId(req: Request): string {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw ApiError.unauthorized();
  }
  return userId;
}

export const askChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const { repositoryId, repositoryUrl, question } = req.body as AskChatQuestionBody;

  if (!repositoryId && !repositoryUrl) {
    throw ApiError.badRequest('Either repositoryId or repositoryUrl is required');
  }

  const result = await askChatQuestion(userId, { repositoryId, repositoryUrl, question });

  sendSuccess(res, 200, 'Chat response generated successfully', result);
});