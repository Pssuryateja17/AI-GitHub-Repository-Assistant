import { AIAnalysis } from '../ai/ai.types';
import { RepositoryMetadata } from './github.types';

export interface AnalyzeRepositoryResponseDto {
  repository: RepositoryMetadata;
  readme: string | null;
  analysis: AIAnalysis;
}