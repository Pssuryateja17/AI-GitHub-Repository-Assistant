import { AIAnalysis } from '../ai/ai.types';
import { RepositoryMetadata } from '../github/github.types';

export type ComparisonWinner = 'A' | 'B' | 'tie';

export interface NumericMetricComparison {
  repositoryA: number;
  repositoryB: number;
  winner: ComparisonWinner;
}

export interface TechnologyComparison {
  repositoryA: string[];
  repositoryB: string[];
  shared: string[];
  uniqueToA: string[];
  uniqueToB: string[];
}

export interface DifficultyComparison {
  repositoryA: AIAnalysis['difficulty'];
  repositoryB: AIAnalysis['difficulty'];
  verdict: string;
}

export interface LearningCurveComparison {
  repositoryA: string;
  repositoryB: string;
  verdict: string;
}

export interface SummaryComparison {
  repositoryA: string;
  repositoryB: string;
}

export interface AdvantagesComparison {
  repositoryA: string[];
  repositoryB: string[];
}

export interface RepositoryComparisonSide {
  metadata: RepositoryMetadata;
  analysis: AIAnalysis;
}

export interface ComparisonResult {
  repositoryA: RepositoryComparisonSide;
  repositoryB: RepositoryComparisonSide;
  comparison: {
    stars: NumericMetricComparison;
    forks: NumericMetricComparison;
    openIssues: NumericMetricComparison;
    technologies: TechnologyComparison;
    difficulty: DifficultyComparison;
    learningCurve: LearningCurveComparison;
    summary: SummaryComparison;
    advantages: AdvantagesComparison;
    overallRecommendation: string;
  };
}
