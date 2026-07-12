import { axiosClient } from './axiosClient';

export type ExportFormat = 'pdf' | 'markdown' | 'json';

interface ExportParams {
  repositoryId?: string;
  repositoryUrl?: string;
}

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback;
  const match = /filename="([^"]+)"/.exec(contentDisposition);
  return match ? match[1] : fallback;
}

export const ExportService = {
  async downloadExport(format: ExportFormat, params: ExportParams): Promise<void> {
    const response = await axiosClient.get(`/export/${format}`, {
      params,
      responseType: 'blob',
    });

    const extension = format === 'markdown' ? 'md' : format;
    const filename = extractFilename(
      response.headers['content-disposition'] as string | undefined,
      `repository-analysis.${extension}`,
    );

    const blobUrl = window.URL.createObjectURL(response.data as Blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
};