import { z } from 'zod';
import { GITHUB_URL_REGEX } from './github.constants';

export const analyzeRepositorySchema = z.object({
  body: z.object({
    repositoryUrl: z
      .string({ required_error: 'repositoryUrl is required' })
      .trim()
      .min(1, 'repositoryUrl is required')
      .regex(
        GITHUB_URL_REGEX,
        'repositoryUrl must be a valid public GitHub repository URL (https://github.com/owner/repository)',
      ),
  }),
});

export type AnalyzeRepositoryInput = z.infer<typeof analyzeRepositorySchema>['body'];