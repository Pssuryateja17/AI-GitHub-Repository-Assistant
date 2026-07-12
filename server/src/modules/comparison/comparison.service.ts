import { analyzeRepositoryWithAI } from '../ai/ai.service';
import { AIAnalysis } from '../ai/ai.types';
import { buildRepositoryContext } from '../github/github.service';
import { RepositoryContext, RepositoryMetadata } from '../github/github.types';
import {
  ComparisonResult,
  ComparisonWinner,
  DifficultyComparison,
  LearningCurveComparison,
  NumericMetricComparison,
  TechnologyComparison,
} from './comparison.types';

function compareNumeric(a: number, b: number): NumericMetricComparison {
  let winner: ComparisonWinner = 'tie';
  if (a > b) winner = 'A';
  else if (b > a) winner = 'B';

  return { repositoryA: a, repositoryB: b, winner };
}

function compareTechnologies(
  technologiesA: string[],
  technologiesB: string[],
): TechnologyComparison {
  const setA = new Set(technologiesA.map((tech) => tech.toLowerCase()));
  const setB = new Set(technologiesB.map((tech) => tech.toLowerCase()));

  const shared = technologiesA.filter((tech) => setB.has(tech.toLowerCase()));
  const uniqueToA = technologiesA.filter((tech) => !setB.has(tech.toLowerCase()));
  const uniqueToB = technologiesB.filter((tech) => !setA.has(tech.toLowerCase()));

  return {
    repositoryA: technologiesA,
    repositoryB: technologiesB,
    shared,
    uniqueToA,
    uniqueToB,
  };
}

const DIFFICULTY_RANK: Record<AIAnalysis['difficulty'], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

function compareDifficulty(
  difficultyA: AIAnalysis['difficulty'],
  difficultyB: AIAnalysis['difficulty'],
): DifficultyComparison {
  const rankA = DIFFICULTY_RANK[difficultyA];
  const rankB = DIFFICULTY_RANK[difficultyB];

  let verdict: string;
  if (rankA === rankB) {
    verdict = `Both repositories are considered ${difficultyA} difficulty.`;
  } else if (rankA < rankB) {
    verdict = `Repository A (${difficultyA}) is more approachable than Repository B (${difficultyB}).`;
  } else {
    verdict = `Repository B (${difficultyB}) is more approachable than Repository A (${difficultyA}).`;
  }

  return { repositoryA: difficultyA, repositoryB: difficultyB, verdict };
}

function describeLearningCurve(difficulty: AIAnalysis['difficulty'], roadmapSteps: number): string {
  return `${difficulty} - approximately ${roadmapSteps} learning roadmap step${roadmapSteps === 1 ? '' : 's'} identified`;
}

function compareLearningCurve(
  analysisA: AIAnalysis,
  analysisB: AIAnalysis,
): LearningCurveComparison {
  const rankA = DIFFICULTY_RANK[analysisA.difficulty];
  const rankB = DIFFICULTY_RANK[analysisB.difficulty];

  let verdict: string;
  if (rankA === rankB) {
    verdict = 'Both repositories present a similar learning curve.';
  } else if (rankA < rankB) {
    verdict = 'Repository A has a gentler learning curve than Repository B.';
  } else {
    verdict = 'Repository B has a gentler learning curve than Repository A.';
  }

  return {
    repositoryA: describeLearningCurve(analysisA.difficulty, analysisA.roadmap.length),
    repositoryB: describeLearningCurve(analysisB.difficulty, analysisB.roadmap.length),
    verdict,
  };
}

function buildOverallRecommendation(
  metadataA: RepositoryMetadata,
  metadataB: RepositoryMetadata,
  analysisA: AIAnalysis,
  analysisB: AIAnalysis,
): string {
  const starsWinner = compareNumeric(metadataA.stars, metadataB.stars).winner;
  const difficultyRankA = DIFFICULTY_RANK[analysisA.difficulty];
  const difficultyRankB = DIFFICULTY_RANK[analysisB.difficulty];

  const popularityNote =
    starsWinner === 'tie'
      ? 'Both repositories have similar community traction.'
      : `${starsWinner === 'A' ? metadataA.fullName : metadataB.fullName} has stronger community traction (more stars).`;

  const learningNote =
    difficultyRankA === difficultyRankB
      ? 'Both are comparable in difficulty to learn.'
      : `${difficultyRankA < difficultyRankB ? metadataA.fullName : metadataB.fullName} is likely easier to learn and contribute to.`;

  return `${popularityNote} ${learningNote}`;
}

async function analyzeOneRepository(
  repositoryUrl: string,
): Promise<{ metadata: RepositoryMetadata; analysis: AIAnalysis }> {
  const context: RepositoryContext = await buildRepositoryContext(repositoryUrl);
  const analysis = await analyzeRepositoryWithAI(context);

  return { metadata: context.metadata, analysis };
}

export async function compareRepositories(
  repositoryAUrl: string,
  repositoryBUrl: string,
): Promise<ComparisonResult> {
  const [sideA, sideB] = await Promise.all([
    analyzeOneRepository(repositoryAUrl),
    analyzeOneRepository(repositoryBUrl),
  ]);

  return {
    repositoryA: sideA,
    repositoryB: sideB,
    comparison: {
      stars: compareNumeric(sideA.metadata.stars, sideB.metadata.stars),
      forks: compareNumeric(sideA.metadata.forks, sideB.metadata.forks),
      openIssues: compareNumeric(sideA.metadata.openIssues, sideB.metadata.openIssues),
      technologies: compareTechnologies(sideA.analysis.technologies, sideB.analysis.technologies),
      difficulty: compareDifficulty(sideA.analysis.difficulty, sideB.analysis.difficulty),
      learningCurve: compareLearningCurve(sideA.analysis, sideB.analysis),
      summary: {
        repositoryA: sideA.analysis.summary,
        repositoryB: sideB.analysis.summary,
      },
      advantages: {
        repositoryA: sideA.analysis.advantages,
        repositoryB: sideB.analysis.advantages,
      },
      overallRecommendation: buildOverallRecommendation(
        sideA.metadata,
        sideB.metadata,
        sideA.analysis,
        sideB.analysis,
      ),
    },
  };
}
