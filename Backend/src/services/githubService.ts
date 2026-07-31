import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AppError } from "../middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, "../../.cache");
const GITHUB_USERNAME = "Abid-Tanoli";
const API_BASE = "https://api.github.com";

const TTL: Record<string, number> = {
  user: 30 * 60_000,
  repos: 60 * 60_000,
  events: 60 * 60_000,
};

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "abid-tanoli-portfolio",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function readCache(key: string): Promise<unknown | null> {
  try {
    const file = path.join(CACHE_DIR, `${key}.json`);
    const raw = await fs.readFile(file, "utf8");
    const entry = JSON.parse(raw) as { fetchedAt: number; data: unknown };
    if (Date.now() - entry.fetchedAt < (TTL[key] ?? 60_000)) return entry.data;
    return null;
  } catch {
    return null;
  }
}

async function writeCache(key: string, data: unknown) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const file = path.join(CACHE_DIR, `${key}.json`);
    await fs.writeFile(file, JSON.stringify({ fetchedAt: Date.now(), data }), "utf8");
  } catch (err) {
    console.warn("[portfolio-api] cache write failed:", err);
  }
}

async function cachedFetch<T>(key: string, url: string): Promise<T> {
  const cached = await readCache(key);
  if (cached) return cached as T;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    if (res.status === 403) {
      const cached = await readCache(key);
      if (cached) return cached as T; // rate-limited: serve stale cache
    }
    throw new AppError(`GitHub API error (${res.status})`, 502);
  }
  const data = (await res.json()) as T;
  await writeCache(key, data);
  return data;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  topics: string[];
  created_at: string;
  pushed_at: string;
  default_branch: string;
}

interface GitHubUser {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubEvent {
  type: string;
  repo: { name: string };
  created_at: string;
}

export type RepoSummary = {
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
};

export async function getUser(): Promise<GitHubUser> {
  return cachedFetch<GitHubUser>("user", `${API_BASE}/users/${GITHUB_USERNAME}`);
}

export async function getRepos(): Promise<RepoSummary[]> {
  const repos = await cachedFetch<GitHubRepo[]>(
    "repos",
    `${API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
  );
  return repos.map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    isFork: r.fork,
    archived: r.archived,
    homepage: r.homepage,
    topics: r.topics,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    defaultBranch: r.default_branch,
  }));
}

export async function getEvents(): Promise<GitHubEvent[]> {
  return cachedFetch<GitHubEvent[]>(
    "events",
    `${API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`
  );
}
