import axios from 'axios';
import { useState } from 'react';
import { ExportFormat, ExportService } from '../../api/exportApi';
import { ErrorAlert } from './ErrorAlert';

interface ExportButtonsProps {
  repositoryId?: string;
  repositoryUrl?: string;
}

const EXPORT_OPTIONS: Array<{ format: ExportFormat; label: string }> = [
  { format: 'pdf', label: 'Export PDF' },
  { format: 'markdown', label: 'Export Markdown' },
  { format: 'json', label: 'Export JSON' },
];

// Since export requests use responseType: 'blob', a validation/error response
// from the backend also arrives as a Blob rather than parsed JSON, so the
// shared extractErrorMessage() utility (which expects error.response.data to
// already be JSON) can't read the real message. This reads the blob as text
// and parses it, falling back to a generic message if that fails.
async function extractBlobErrorMessage(error: unknown): Promise<string> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed.message) return parsed.message;
    } catch {
      // fall through to generic message below
    }
  }
  return 'Failed to generate the export. Please try again.';
}

export function ExportButtons({ repositoryId, repositoryUrl }: ExportButtonsProps) {
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExport(format: ExportFormat): Promise<void> {
    if (loadingFormat) return;

    setError(null);
    setLoadingFormat(format);
    try {
      await ExportService.downloadExport(format, { repositoryId, repositoryUrl });
    } catch (caughtError) {
      setError(await extractBlobErrorMessage(caughtError));
    } finally {
      setLoadingFormat(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {EXPORT_OPTIONS.map((option) => {
          const isLoading = loadingFormat === option.format;
          return (
            <button
              key={option.format}
              type="button"
              onClick={() => void handleExport(option.format)}
              disabled={Boolean(loadingFormat)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-200 ease-out hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {isLoading ? (
                <svg
                  className="h-3.5 w-3.5 animate-spin text-slate-500 dark:text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                >
                  <path d="M10 2a.75.75 0 01.75.75v7.19l2.22-2.22a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l2.22 2.22V2.75A.75.75 0 0110 2Z" />
                  <path d="M3 13.25a.75.75 0 01.75.75v1.5c0 .414.336.75.75.75h11a.75.75 0 00.75-.75v-1.5a.75.75 0 011.5 0v1.5A2.25 2.25 0 0115.5 17.5h-11A2.25 2.25 0 012.25 15.5v-1.5a.75.75 0 01.75-.75Z" />
                </svg>
              )}
              {isLoading ? 'Preparing...' : option.label}
            </button>
          );
        })}
      </div>

      {error ? <ErrorAlert error={error} onDismiss={() => setError(null)} /> : null}
    </div>
  );
}