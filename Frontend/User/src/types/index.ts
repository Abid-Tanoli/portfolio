export interface Certification {
  id: string;
  title: string;
  issuer: string;
  batch: string;
  credential?: string;
  imageUrl?: string;
  order?: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id?: string;
  name: string;
  firstName: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  location: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  linkedinPending: boolean;
  resumeUrl: string;
  resumeSummary: string;
  resumeUpdatedAt?: string;
  profilePictureUrl: string;
  heroSublines: string[];
  heroSummary: string;
  aboutSummary: string[];
  careerGoals: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "ai" | "deployment" | "tools";
  icon?: string;
  order: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillExportGroup extends SkillGroup {
  records: Skill[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  approved?: boolean;
  order?: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type { Experience, Education } from "./experience";
export type { Project, EnrichedProject } from "./project";

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
