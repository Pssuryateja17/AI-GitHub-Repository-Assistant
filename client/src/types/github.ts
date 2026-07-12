export interface LatestRelease {
  tagName: string;
  name: string | null;
  publishedAt: string | null;
  url: string;
}

export interface RepositoryMetadata {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  primaryLanguage: string | null;
  languages: Record<string, number>;
  topics: string[];
  sizeKb: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  license: string | null;
  latestRelease: LatestRelease | null;
  contributorsCount: number;
  ownerAvatarUrl: string;
}

export type Repository = RepositoryMetadata;

export interface Language {
  name: string;
  bytes: number;
  percentage: number;
}

export interface AIAnalysis {
  summary: string;
  purpose: string;
  technologies: string[];
  languages: string[];
  frameworks: string[];
  architecture: string;
  folderStructure: string;
  installation: string;
  dependencies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  advantages: string[];
  disadvantages: string[];
  bestPractices: string[];
  improvements: string[];
  roadmap: string[];
  careerSkills: string[];
  targetUsers: string[];
}

export interface AnalysisResponse {
  repository: RepositoryMetadata;
  readme: string | null;
  analysis: AIAnalysis;
}

export interface APIError {
  success: false;
  message: string;
  errors?: Array<{ path: string; message: string }>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';