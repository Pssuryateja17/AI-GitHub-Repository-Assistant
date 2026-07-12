export const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';
export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
export const OLLAMA_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT) || 30000;
export const DEFAULT_AI_CACHE_TTL = Number(process.env.CACHE_TTL) || 300;

export const AI_JSON_SCHEMA = `{
  "summary": "string - a concise 3-5 sentence overview of what the repository does",
  "purpose": "string - the core problem this project solves",
  "technologies": ["string - key technologies used"],
  "languages": ["string - programming languages used"],
  "frameworks": ["string - frameworks or major libraries used"],
  "architecture": "string - a description of the architectural pattern used",
  "folderStructure": "string - a description of the notable top-level folders and their roles",
  "installation": "string - concise step-by-step installation instructions",
  "dependencies": ["string - notable dependencies"],
  "difficulty": "Beginner | Intermediate | Advanced - difficulty to understand and contribute",
  "advantages": ["string - strengths of the project"],
  "disadvantages": ["string - weaknesses or limitations"],
  "bestPractices": ["string - best practices this project demonstrates"],
  "improvements": ["string - suggested improvements"],
  "roadmap": ["string - ordered learning roadmap steps to understand this repository"],
  "careerSkills": ["string - career-relevant skills a developer would gain"],
  "targetUsers": ["string - who this project is best suited for"]
}`;

export const AI_SYSTEM_PROMPT = `You are a senior software architect who analyzes GitHub repositories for developers, students, and recruiters.
You must respond with ONLY valid JSON matching the exact schema provided. Do not include markdown formatting, code fences, comments, or any text outside the JSON object. Do not include trailing commas.`;

export function buildAnalysisPrompt(contextSummary: string): string {
  return `Analyze the following GitHub repository and return a JSON object matching exactly this schema:

${AI_JSON_SCHEMA}

Repository information:
${contextSummary}

Respond with ONLY the JSON object, and nothing else.`;
}