import { ApiError } from '../../utils/ApiError';
import { GITHUB_URL_REGEX } from './github.constants';
import { OwnerRepo } from './github.types';

export function extractOwnerRepo(repositoryUrl: string): OwnerRepo {
  const match = GITHUB_URL_REGEX.exec(repositoryUrl.trim());

  if (!match) {
    throw ApiError.badRequest(
      'Invalid GitHub repository URL. Expected format: https://github.com/owner/repository',
    );
  }

  const [, owner, repo] = match;

  return { owner, repo: repo.replace(/\.git$/, '') };
}

export function decodeBase64Content(content: string): string {
  return Buffer.from(content, 'base64').toString('utf-8');
}