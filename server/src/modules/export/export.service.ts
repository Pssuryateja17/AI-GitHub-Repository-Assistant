import { ApiError } from '../../utils/ApiError';
import { analyzeRepositoryWithAI } from '../ai/ai.service';
import { AIAnalysis } from '../ai/ai.types';
import { buildRepositoryContext } from '../github/github.service';
import { RepositoryMetadata } from '../github/github.types';
import { getAnalysisHistoryEntry } from '../history/history.service';
import { buildJsonExport } from './export.json';
import { buildMarkdownExport } from './export.markdown';
import { buildPdfExport } from './export.pdf';
import { ExportFileResult, ExportRequestInput } from './export.types';

// NOTE: this mirrors resolveRepositoryContext() in chat.service.ts. That
// function is not exported from chat.service.ts (a completed file this task
// must not modify), so it's duplicated here rather than shared. A future
// refactor should extract both into a shared repositoryContext.resolver.ts.
async function resolveRepositoryContext(
  userId: string,
  input: Pick<ExportRequestInput, 'repositoryId' | 'repositoryUrl'>,
): Promise<{ metadata: RepositoryMetadata; analysis: AIAnalysis }> {
  if (input.repositoryId) {
    const historyEntry = await getAnalysisHistoryEntry(input.repositoryId, userId);
    return {
      metadata: historyEntry.metadata as unknown as RepositoryMetadata,
      analysis: historyEntry.analysis as unknown as AIAnalysis,
    };
  }

  if (input.repositoryUrl) {
    const context = await buildRepositoryContext(input.repositoryUrl);
    const analysis = await analyzeRepositoryWithAI(context);
    return { metadata: context.metadata, analysis };
  }

  throw ApiError.badRequest('Either repositoryId or repositoryUrl is required');
}

function buildFilename(repositoryFullName: string, format: ExportRequestInput['format']): string {
  const safeName = repositoryFullName.replace(/[^a-zA-Z0-9._-]+/g, '_');
  const extension = format === 'markdown' ? 'md' : format;
  return `${safeName}-analysis.${extension}`;
}

export async function generateExport(
  userId: string,
  input: ExportRequestInput,
): Promise<ExportFileResult> {
  const { metadata, analysis } = await resolveRepositoryContext(userId, input);
  const filename = buildFilename(metadata.fullName, input.format);

  switch (input.format) {
    case 'pdf': {
      const buffer = await buildPdfExport(metadata, analysis);
      return { buffer, filename, contentType: 'application/pdf' };
    }
    case 'markdown': {
      const buffer = Buffer.from(buildMarkdownExport(metadata, analysis), 'utf-8');
      return { buffer, filename, contentType: 'text/markdown' };
    }
    case 'json': {
      const buffer = buildJsonExport(metadata, analysis);
      return { buffer, filename, contentType: 'application/json' };
    }
    default:
      throw ApiError.badRequest('Unsupported export format');
  }
}