export const EXPORT_FORMATS = ['pdf', 'markdown', 'json'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface ExportRequestInput {
  repositoryId?: string;
  repositoryUrl?: string;
  format: ExportFormat;
}

export interface ExportFileResult {
  buffer: Buffer;
  filename: string;
  contentType: string;
}