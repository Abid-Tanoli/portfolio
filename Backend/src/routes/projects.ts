import { Router } from "express";
import { getRepos, type RepoSummary } from "../services/githubService.js";
import { asyncHandler } from "./_helpers.js";

type ProjectStatus = "live" | "in-progress" | "archived" | "verify";
type ProjectCategory = "flagship" | "full-stack" | "ai" | "coursework";

interface ProjectLink {
  label: string;
  url: string;
}

interface CuratedProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  stack: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  statusNote?: string;
  repoUrl: string;
  links: ProjectLink[];
  startedAt: string;
  isFeatured: boolean;
  repoNames: string[];
}

const curatedProjects: CuratedProject[] = [
  {
    slug: "bq-play",
    name: "BQ-PLAY (CricAll)",
    tagline: "Live cricket scoring & tournament platform",
    description:
      "Flagship MERN project with public score pages, an admin scoring console, real-time Socket.IO updates, tournament workflows, and AI-powered commentary.",
    features: [
      "Real-time score updates across user and admin apps",
      "Ball-by-ball scoring console with match setup",
      "AI commentary and live cricket data integrations",
      "22 MongoDB models and 20+ backend route groups",
    ],
    stack: ["React", "Redux Toolkit", "Socket.IO", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    category: "flagship",
    status: "live",
    statusNote: "Deployed on Vercel + Railway. Direct URLs pending dashboard confirmation.",
    repoUrl: "https://github.com/Abid-Tanoli/BQ-PLAY",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/BQ-PLAY" }],
    startedAt: "2026-01-12",
    isFeatured: true,
    repoNames: ["BQ-PLAY"],
  },
  {
    slug: "lowpricemart",
    name: "LowPriceMart",
    tagline: "Full-stack e-commerce platform",
    description:
      "Three-tier e-commerce application with customer storefront, admin analytics, Node/Express API, MongoDB, JWT auth, Cloudinary uploads, Nodemailer, Zod validation, and Playwright tests.",
    features: [
      "Separate user and admin React frontends",
      "Admin analytics dashboard",
      "JWT auth, Cloudinary uploads, and email flows",
      "Playwright end-to-end test coverage",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Redux Toolkit", "Node.js", "Express", "MongoDB", "JWT", "Playwright"],
    category: "full-stack",
    status: "in-progress",
    statusNote: "Actively developed. Live deployment pending confirmation.",
    repoUrl: "https://github.com/Abid-Tanoli/LowPriceMart",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/LowPriceMart" }],
    startedAt: "2025-12-04",
    isFeatured: true,
    repoNames: ["LowPriceMart"],
  },
  {
    slug: "event-organizer",
    name: "Event Organizer",
    tagline: "Event booking & management platform",
    description:
      "TypeScript full-stack event booking app with React, Node/Express, MongoDB, JWT auth, and a Vercel serverless-ready API structure.",
    features: [
      "Authentication with JWT sessions",
      "User, admin, event, and category modules",
      "TypeScript across frontend and backend",
      "Vercel serverless-ready API entry point",
    ],
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "JWT", "Vercel"],
    category: "full-stack",
    status: "verify",
    statusNote: "Repo has a Vercel URL, but it must be verified before listing as a live demo.",
    repoUrl: "https://github.com/Abid-Tanoli/Event-Organizer",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/Event-Organizer" }],
    startedAt: "2026-02-03",
    isFeatured: true,
    repoNames: ["Event-Organizer"],
  },
  {
    slug: "tourist-places-guide",
    name: "Tourist Places Guide",
    tagline: "MERN travel guide with user & admin apps",
    description:
      "MERN tourist guide with separate user/admin Vite frontends, Express/Mongoose backend, and CRUD flows for places and categories.",
    features: ["User and admin React frontends", "Express + Mongoose backend", "CRUD for tourist places and categories"],
    stack: ["React", "Vite", "Node.js", "Express", "MongoDB", "Mongoose"],
    category: "full-stack",
    status: "in-progress",
    statusNote: "Active development. Deployment pending.",
    repoUrl: "https://github.com/Abid-Tanoli/tourist-places-guide",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/tourist-places-guide" }],
    startedAt: "2026-07-09",
    isFeatured: false,
    repoNames: ["tourist-places-guide"],
  },
  {
    slug: "ecommerce",
    name: "ECommerce (Learning)",
    tagline: "Self-learning e-commerce build",
    description: "Early e-commerce application from the backend learning phase.",
    features: ["Product listing and cart flows", "First pass at REST API design"],
    stack: ["JavaScript", "Node.js", "Express", "MongoDB"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/ECommerce",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/ECommerce" }],
    startedAt: "2025-11-04",
    isFeatured: false,
    repoNames: ["ECommerce"],
  },
  {
    slug: "web-3-backend",
    name: "Web-3 Bano Qabil Backend",
    tagline: "Bano Qabil 4.0 backend coursework",
    description: "TypeScript backend coursework covering Node.js, Express, and MongoDB patterns.",
    features: ["Express server patterns in TypeScript", "MongoDB + Mongoose fundamentals"],
    stack: ["TypeScript", "Node.js", "Express", "MongoDB"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/Web-3-Bano-Qabil-Backend",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/Web-3-Bano-Qabil-Backend" }],
    startedAt: "2025-11-21",
    isFeatured: false,
    repoNames: ["Web-3-Bano-Qabil-Backend"],
  },
  {
    slug: "web-2-assignments",
    name: "Web-2 Bano Qabil",
    tagline: "JavaScript fundamentals & assignments",
    description: "JavaScript practice covering logic building, arrays, objects, and beginner challenges.",
    features: ["Logic-building exercises", "Array/object method practice"],
    stack: ["JavaScript"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/Web-2-Bano-Qabil",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/Web-2-Bano-Qabil" }],
    startedAt: "2025-07-21",
    isFeatured: false,
    repoNames: ["Web-2-Bano-Qabil"],
  },
  {
    slug: "web-dev-1-projects",
    name: "Web Dev 1 - Final & Mid-Term",
    tagline: "Bano Qabil web development coursework",
    description: "HTML/CSS course projects from the first web development phase.",
    features: ["Responsive HTML/CSS layouts", "Course projects from Web Dev 1"],
    stack: ["HTML", "CSS"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/Final-Project-Web-dev-1",
    links: [
      { label: "Final Project", url: "https://github.com/Abid-Tanoli/Final-Project-Web-dev-1" },
      { label: "Mid-Term", url: "https://github.com/Abid-Tanoli/Mid-Term_Web-dev-1" },
      { label: "Assignment", url: "https://github.com/Abid-Tanoli/assigment" },
    ],
    startedAt: "2024-08-20",
    isFeatured: false,
    repoNames: ["Final-Project-Web-dev-1", "Mid-Term_Web-dev-1", "assigment"],
  },
];

function findRepo(project: CuratedProject, repos: RepoSummary[]) {
  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  return project.repoNames.map((name) => byName.get(name.toLowerCase())).find(Boolean);
}

function toPublicProject(project: CuratedProject, repo?: RepoSummary) {
  return {
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    description: project.description,
    features: project.features,
    stack: project.stack,
    category: project.category,
    status: project.status,
    statusNote: project.statusNote,
    repoUrl: project.repoUrl,
    links: project.links,
    startedAt: project.startedAt,
    isFeatured: project.isFeatured,
    language: repo?.language ?? null,
    stars: repo?.stars ?? 0,
    forks: repo?.forks ?? 0,
    pushedAt: repo?.pushedAt,
    topics: repo?.topics ?? [],
  };
}

export const projectsRouter = Router();

projectsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    let repos: RepoSummary[] = [];

    try {
      repos = await getRepos();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[portfolio-api] GitHub enrichment unavailable for /api/projects: ${message}`);
    }

    const projects = curatedProjects.map((project) => toPublicProject(project, findRepo(project, repos)));
    res.json({ source: repos.length > 0 ? "github+curated" : "curated", projects });
  })
);
