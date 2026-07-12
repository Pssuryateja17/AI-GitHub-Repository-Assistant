import { prisma } from '../../lib/prisma';
import { RepositoryMetadata } from '../github/github.types';
import { AIAnalysis } from '../ai/ai.types';
import {
  AnalyticsOverview,
  DifficultyDistributionEntry,
  LanguageDistributionEntry,
} from './analytics.types';

// Comparisons are not persisted anywhere in this codebase (Module 3 kept
// /api/compare stateless - no ComparisonLog table exists). This is surfaced
// honestly via the note field rather than fabricating a count.
const COMPARISONS_NOT_TRACKED_NOTE =
  'Comparisons are not currently persisted; this endpoint always returns 0 for totalComparisons until a comparison log is added.';

function buildLanguageDistribution(
  entries: Array<{ metadata: unknown }>,
): LanguageDistributionEntry[] {
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    const metadata = entry.metadata as Partial<RepositoryMetadata> | null;
    const language = metadata?.primaryLanguage || 'Unknown';
    counts.set(language, (counts.get(language) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}

function buildDifficultyDistribution(
  entries: Array<{ analysis: unknown }>,
): DifficultyDistributionEntry[] {
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    const analysis = entry.analysis as Partial<AIAnalysis> | null;
    const difficulty = analysis?.difficulty || 'Unknown';
    counts.set(difficulty, (counts.get(difficulty) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([difficulty, count]) => ({ difficulty, count }));
}

export async function getAnalyticsOverviewForUser(userId: string): Promise<AnalyticsOverview> {
  const [totalAnalyses, totalSaved, historyEntries] = await Promise.all([
    prisma.analysisHistory.count({ where: { userId } }),
    prisma.savedRepository.count({ where: { userId } }),
    prisma.analysisHistory.findMany({
      where: { userId },
      select: { metadata: true, analysis: true },
    }),
  ]);

  return {
    totalAnalyses,
    totalSaved,
    totalComparisons: 0,
    totalComparisonsNote: COMPARISONS_NOT_TRACKED_NOTE,
    languageDistribution: buildLanguageDistribution(historyEntries),
    difficultyDistribution: buildDifficultyDistribution(historyEntries),
  };
}