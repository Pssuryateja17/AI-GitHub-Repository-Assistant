import { ApiError } from '../../utils/ApiError';
import { InMemoryCache } from '../../utils/inMemoryCache';
import { githubGet } from './github.client';
import { extractOwnerRepo, decodeBase64Content } from './github.utils';
import { DEFAULT_CACHE_TTL_SECONDS } from './github.constants';
import {
  GithubContributorRaw,
  GithubReleaseRaw,
  GithubRepositoryRaw,
  OwnerRepo,
  RepositoryContext,
  RepositoryLanguages,
  RepositoryMetadata,
} from './github.types';

const repositoryCache = new InMemoryCache<RepositoryContext>(DEFAULT_CACHE_TTL_SECONDS);

export { extractOwnerRepo };

export async function fetchRepository(ownerRepo: OwnerRepo): Promise<GithubRepositoryRaw> {
  const { owner, repo } = ownerRepo;
  const response = await githubGet<GithubRepositoryRaw>(`/repos/${owner}/${repo}`);

  if (response.data.private) {
    throw ApiError.forbidden('This repository is private. Only public repositories are supported.');
  }

  return response.data;
}

export async function fetchReadme(ownerRepo: OwnerRepo): Promise<string | null> {
  const { owner, repo } = ownerRepo;

  try {
    const response = await githubGet<{ content: string; encoding: string }>(
      `/repos/${owner}/${repo}/readme`,
    );

    if (response.data.encoding === 'base64') {
      return decodeBase64Content(response.data.content);
    }

    return response.data.content;
  } catch {
    return null;
  }
}

export async function fetchLanguages(ownerRepo: OwnerRepo): Promise<RepositoryLanguages> {
  const { owner, repo } = ownerRepo;
  const response = await githubGet<RepositoryLanguages>(`/repos/${owner}/${repo}/languages`);
  return response.data;
}

export async function fetchTopics(ownerRepo: OwnerRepo): Promise<string[]> {
  const { owner, repo } = ownerRepo;
  const response = await githubGet<{ names: string[] }>(`/repos/${owner}/${repo}/topics`);
  return response.data.names ?? [];
}

export async function fetchContributors(ownerRepo: OwnerRepo): Promise<GithubContributorRaw[]> {
  const { owner, repo } = ownerRepo;
  try {
    const response = await githubGet<GithubContributorRaw[]>(
      `/repos/${owner}/${repo}/contributors`,
      { params: { per_page: 100, anon: 0 } },
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function fetchLatestRelease(ownerRepo: OwnerRepo): Promise<GithubReleaseRaw | null> {
  const { owner, repo } = ownerRepo;
  try {
    const response = await githubGet<GithubReleaseRaw>(
      `/repos/${owner}/${repo}/releases/latest`,
    );
    return response.data;
  } catch {
    return null;
  }
}

export function fetchLicense(repository: GithubRepositoryRaw): string | null {
  return repository.license?.name ?? null;
}

export async function fetchRepositoryStats(ownerRepo: OwnerRepo): Promise<{
  contributorsCount: number;
}> {
  const contributors = await fetchContributors(ownerRepo);
  return { contributorsCount: contributors.length };
}

export async function buildRepositoryContext(repositoryUrl: string): Promise<RepositoryContext> {
  const ownerRepo = extractOwnerRepo(repositoryUrl);
  const cacheKey = `${ownerRepo.owner}/${ownerRepo.repo}`.toLowerCase();

  const cached = repositoryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const [repository, languages, topics, contributors, latestRelease, readme] = await Promise.all([
    fetchRepository(ownerRepo),
    fetchLanguages(ownerRepo),
    fetchTopics(ownerRepo),
    fetchContributors(ownerRepo),
    fetchLatestRelease(ownerRepo),
    fetchReadme(ownerRepo),
  ]);

  const metadata: RepositoryMetadata = {
    owner: repository.owner.login,
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description,
    url: repository.html_url,
    homepage: repository.homepage,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,
    defaultBranch: repository.default_branch,
    primaryLanguage: repository.language,
    languages,
    topics: topics.length > 0 ? topics : (repository.topics ?? []),
    sizeKb: repository.size,
    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at,
    license: fetchLicense(repository),
    latestRelease: latestRelease
      ? {
          tagName: latestRelease.tag_name,
          name: latestRelease.name,
          publishedAt: latestRelease.published_at,
          url: latestRelease.html_url,
        }
      : null,
    contributorsCount: contributors.length,
    ownerAvatarUrl: repository.owner.avatar_url,
  };

  const context: RepositoryContext = { metadata, readme };

  repositoryCache.set(cacheKey, context);

  return context;
}