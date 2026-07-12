export interface LanguageDistributionEntry {
  language: string;
  count: number;
}

export interface DifficultyDistributionEntry {
  difficulty: string;
  count: number;
}

export interface AnalyticsOverview {
  totalAnalyses: number;
  totalSaved: number;
  totalComparisons: number;
  totalComparisonsNote: string;
  languageDistribution: LanguageDistributionEntry[];
  difficultyDistribution: DifficultyDistributionEntry[];
}