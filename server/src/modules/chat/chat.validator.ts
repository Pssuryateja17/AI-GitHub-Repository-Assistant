import { z } from 'zod';
import { GITHUB_URL_REGEX } from '../github/github.constants';
import { CHAT_QUESTION_MAX_LENGTH } from './chat.constants';

export const askChatQuestionSchema = z.object({
  body: z.object({
    repositoryId: z.string().uuid('repositoryId must be a valid UUID').optional(),
    repositoryUrl: z
      .string()
      .trim()
      .regex(GITHUB_URL_REGEX, 'repositoryUrl must be a valid public GitHub repository URL')
      .optional(),
    question: z
      .string({ required_error: 'question is required' })
      .trim()
      .min(1, 'question is required')
      .max(CHAT_QUESTION_MAX_LENGTH, `question must be at most ${CHAT_QUESTION_MAX_LENGTH} characters`),
  }),
});

export type AskChatQuestionBody = z.infer<typeof askChatQuestionSchema>['body'];