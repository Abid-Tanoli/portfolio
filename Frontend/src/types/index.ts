export interface Certification {
  id: string;
  title: string;
  issuer: string;
  batch: string;
  credential?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  icon: string;
}

export interface GithubRepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isFork: boolean;
  archived: boolean;
  homepage: string | null;
  topics: string[];
  createdAt: string;
  pushedAt: string;
  defaultBranch: string;
}

export interface GithubUserSummary {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubEventSummary {
  type: string;
  repo: { name: string };
  created_at: string;
}
