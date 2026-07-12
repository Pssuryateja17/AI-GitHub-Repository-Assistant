import { InMemoryCache } from '../../utils/inMemoryCache';
import { RepositoryContext } from '../github/github.types';
import { generateCompletion } from './ai.client';
import { AI_SYSTEM_PROMPT, buildAnalysisPrompt, DEFAULT_AI_CACHE_TTL } from './ai.constants';
import { parseAIResponse } from './ai.parser';
import { AIAnalysis } from './ai.types';

const analysisCache = new InMemoryCache<AIAnalysis>(DEFAULT_AI_CACHE_TTL);

function buildContextSummary(context: RepositoryContext): string {
  const { metadata, readme } = context;

  const languageList = Object.keys(metadata.languages).join(', ') || 'Not specified';
  const readmeExcerpt = readme ? readme.slice(0, 6000) : 'No README available';

  return `Name: ${metadata.fullName}
Description: ${metadata.description ?? 'No description provided'}
Primary Language: ${metadata.primaryLanguage ?? 'Unknown'}
All Languages: ${languageList}
Topics: ${metadata.topics.join(', ') || 'None'}
Stars: ${metadata.stars}
Forks: ${metadata.forks}
Open Issues: ${metadata.openIssues}
License: ${metadata.license ?? 'None'}
Size (KB): ${metadata.sizeKb}
Contributors: ${metadata.contributorsCount}
Latest Release: ${metadata.latestRelease?.tagName ?? 'None'}
Created: ${metadata.createdAt}
Last Updated: ${metadata.updatedAt}

README (truncated):
${readmeExcerpt}`;
}

export async function analyzeRepositoryWithAI(context: RepositoryContext): Promise<AIAnalysis> {
  const cacheKey = context.metadata.fullName.toLowerCase();
  const cached = analysisCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const contextSummary = buildContextSummary(context);
  const prompt = buildAnalysisPrompt(contextSummary);
  const rawResponse = await generateCompletion(AI_SYSTEM_PROMPT, prompt);
  const analysis = parseAIResponse(rawResponse);

  analysisCache.set(cacheKey, analysis);

  return analysis;
}