export const GITHUB_API_BASE_URL = 'https://api.github.com';
export const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com';

// Matches https://github.com/{owner}/{repo} with optional trailing slash, .git suffix, or path
export const GITHUB_URL_REGEX =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38})\/([a-zA-Z0-9._-]+?)(?:\.git)?\/?(?:[/?#].*)?$/;

export const DEFAULT_REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT) || 30000;
export const DEFAULT_CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL) || 300;

export const README_CANDIDATE_PATHS = ['readme', 'readme.md', 'README', 'README.md'];

export const GITHUB_ANALYZE_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const GITHUB_ANALYZE_RATE_LIMIT_MAX = 20;