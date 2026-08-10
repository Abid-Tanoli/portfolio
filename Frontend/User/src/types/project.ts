export type ProjectStatus = "live" | "in-progress" | "archived" | "verify";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  stack: string[];
  category: "flagship" | "full-stack" | "ai" | "coursework";
  status: ProjectStatus;
  statusNote?: string;
  repoUrl: string;
  links: ProjectLink[];
  startedAt: string;
  isFeatured: boolean;
}

export interface EnrichedProject extends Project {
  language?: string | null;
  stars: number;
  forks: number;
  pushedAt?: string;
  topics: string[];
  languageShare?: number;
}
