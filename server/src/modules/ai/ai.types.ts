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

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  stream: boolean;
  format?: 'json';
  options?: {
    temperature?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
}