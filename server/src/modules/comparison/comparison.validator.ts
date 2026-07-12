import { z } from 'zod';
import { GITHUB_URL_REGEX } from '../github/github.constants';

export const compareRepositoriesSchema = z.object({
  body: z.object({
    repositoryAUrl: z
      .string({ required_error: 'repositoryAUrl is required' })
      .trim()
      .min(1, 'repositoryAUrl is required')
      .regex(GITHUB_URL_REGEX, 'repositoryAUrl must be a valid public GitHub repository URL'),
    repositoryBUrl: z
      .string({ required_error: 'repositoryBUrl is required' })
      .trim()
      .min(1, 'repositoryBUrl is required')
      .regex(GITHUB_URL_REGEX, 'repositoryBUrl must be a valid public GitHub repository URL'),
  }),
});

export type CompareRepositoriesInput = {
  repositoryAUrl: string;
  repositoryBUrl: string;
};
