import { AIAnalysis } from '../ai/ai.types';
import { RepositoryMetadata } from '../github/github.types';

export function buildJsonExport(metadata: RepositoryMetadata, analysis: AIAnalysis): Buffer {
  const payload = {
    exportedAt: new Date().toISOString(),
    repository: metadata,
    analysis,
  };

  return Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
}