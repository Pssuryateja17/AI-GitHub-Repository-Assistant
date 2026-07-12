import { z } from 'zod';

export const saveAnalysisHistorySchema = z.object({
  body: z.object({
    repositoryFullName: z
      .string({ required_error: 'repositoryFullName is required' })
      .trim()
      .min(1, 'repositoryFullName is required'),
    repositoryUrl: z
      .string({ required_error: 'repositoryUrl is required' })
      .trim()
      .url('repositoryUrl must be a valid URL'),
    metadata: z.record(z.unknown(), { required_error: 'metadata is required' }),
    analysis: z.record(z.unknown(), { required_error: 'analysis is required' }),
  }),
});

export const listAnalysisHistorySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : undefined))
      .refine((value) => value === undefined || (Number.isInteger(value) && value > 0), {
        message: 'page must be a positive integer',
      }),
    pageSize: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : undefined))
      .refine((value) => value === undefined || (Number.isInteger(value) && value > 0), {
        message: 'pageSize must be a positive integer',
      }),
  }),
});

export const historyIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }).uuid('id must be a valid UUID'),
  }),
});

export type SaveAnalysisHistoryInput = z.infer<typeof saveAnalysisHistorySchema>['body'];
export type ListAnalysisHistoryQuery = z.infer<typeof listAnalysisHistorySchema>['query'];
