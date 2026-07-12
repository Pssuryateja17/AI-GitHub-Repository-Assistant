import { ApiError } from '../../utils/ApiError';
import { AIAnalysis } from './ai.types';

const REQUIRED_STRING_FIELDS: Array<keyof AIAnalysis> = [
  'summary',
  'purpose',
  'architecture',
  'folderStructure',
  'installation',
  'difficulty',
];

const REQUIRED_ARRAY_FIELDS: Array<keyof AIAnalysis> = [
  'technologies',
  'languages',
  'frameworks',
  'dependencies',
  'advantages',
  'disadvantages',
  'bestPractices',
  'improvements',
  'roadmap',
  'careerSkills',
  'targetUsers',
];

const VALID_DIFFICULTIES = new Set(['Beginner', 'Intermediate', 'Advanced']);

function stripMarkdownFences(raw: string): string {
  return raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
}

function extractJsonObject(raw: string): string {
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw ApiError.internal('AI response did not contain a JSON object');
  }

  return raw.slice(firstBrace, lastBrace + 1);
}

function removeTrailingCommas(raw: string): string {
  return raw.replace(/,(\s*[}\]])/g, '$1');
}

function fixUnquotedNewlines(raw: string): string {
  // Collapses stray literal newlines inside string values that break JSON.parse
  return raw.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => match.replace(/\r?\n/g, '\\n'));
}

function repairJsonString(raw: string): string {
  let repaired = stripMarkdownFences(raw);
  repaired = extractJsonObject(repaired);
  repaired = removeTrailingCommas(repaired);
  return repaired;
}

function coerceStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value];
  }
  return [];
}

function validateAndNormalize(parsed: Record<string, unknown>): AIAnalysis {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof parsed[field] !== 'string' || (parsed[field] as string).trim().length === 0) {
      parsed[field] = field === 'difficulty' ? 'Intermediate' : 'Not available';
    }
  }

  for (const field of REQUIRED_ARRAY_FIELDS) {
    parsed[field] = coerceStringArray(parsed[field]);
  }

  if (!VALID_DIFFICULTIES.has(parsed.difficulty as string)) {
    parsed.difficulty = 'Intermediate';
  }

  return parsed as unknown as AIAnalysis;
}

export function parseAIResponse(rawResponse: string): AIAnalysis {
  let jsonString: string;

  try {
    jsonString = repairJsonString(rawResponse);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internal('Failed to repair malformed AI response');
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonString);
  } catch {
    try {
      parsed = JSON.parse(fixUnquotedNewlines(jsonString));
    } catch {
      throw ApiError.internal('AI response could not be parsed as valid JSON after repair attempts');
    }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw ApiError.internal('AI response JSON was not a valid object');
  }

  return validateAndNormalize(parsed as Record<string, unknown>);
}