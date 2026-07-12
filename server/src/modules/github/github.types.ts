export interface OwnerRepo {
  owner: string;
  repo: string;
}

export interface GithubRepositoryRaw {
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string; html_url: string };
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  language: string | null;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: { key: string; name: string; spdx_id: string } | null;
  topics?: string[];
  private: boolean;
  archived: boolean;
}

export interface GithubContributorRaw {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GithubReleaseRaw {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
}

export interface RepositoryLanguages {
  [language: string]: number;
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
  languages: RepositoryLanguages;
  topics: string[];
  sizeKb: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  license: string | null;
  latestRelease: {
    tagName: string;
    name: string | null;
    publishedAt: string | null;
    url: string;
  } | null;
  contributorsCount: number;
  ownerAvatarUrl: string;
}

export interface RepositoryContext {
  metadata: RepositoryMetadata;
  readme: string | null;
}