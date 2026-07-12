import { z } from 'zod';
import { GITHUB_URL_REGEX } from '../github/github.constants';
import { EXPORT_FORMATS } from './export.types';

export const exportRequestSchema = z.object({
  params: z.object({
    format: z.enum(EXPORT_FORMATS, {
      errorMap: () => ({ message: `format must be one of: ${EXPORT_FORMATS.join(', ')}` }),
    }),
  }),
  query: z.object({
    repositoryId: z.string().uuid('repositoryId must be a valid UUID').optional(),
    repositoryUrl: z
      .string()
      .trim()
      .regex(GITHUB_URL_REGEX, 'repositoryUrl must be a valid public GitHub repository URL')
      .optional(),
  }),
});