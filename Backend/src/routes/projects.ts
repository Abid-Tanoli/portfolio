import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { getRepos, type RepoSummary } from "../services/githubService.js";
import { requireAuth } from "../middleware/auth.middleware.js";
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
  screenshotUrls?: string[];
  order?: number;
}

const fallbackProjects: CuratedProject[] = [
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
    order: 0,
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
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
  },
];

function findRepo(repoNames: string[], repos: RepoSummary[]) {
  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  return repoNames.map((name) => byName.get(name.toLowerCase())).find(Boolean);
}

function toPublicProject(project: any, repo?: RepoSummary) {
  return {
    id: project._id || project.slug,
    _id: project._id,
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    description: project.description,
    features: project.features || [],
    stack: project.stack || [],
    category: project.category,
    status: project.status,
    statusNote: project.statusNote,
    repoUrl: project.repoUrl,
    links: project.links || [],
    startedAt: project.startedAt,
    isFeatured: Boolean(project.isFeatured),
    isVisible: project.isVisible !== false,
    screenshotUrls: project.screenshotUrls || [],
    order: project.order ?? 0,
    language: repo?.language ?? null,
    stars: repo?.stars ?? 0,
    forks: repo?.forks ?? 0,
    pushedAt: repo?.pushedAt,
    topics: repo?.topics ?? [],
  };
}

export const projectsRouter = Router();

// GET /api/projects (Public list)
projectsRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    let rawProjects: any[] = [];
    let usingFallback = false;
    let canUseFallback = false;

    try {
      rawProjects = await Project.find({ isVisible: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean();
      canUseFallback = !(await Project.exists());
    } catch (e) {
      console.warn("[projects] Error fetching projects from MongoDB, using fallback array");
      canUseFallback = true;
    }

    if (rawProjects.length === 0 && canUseFallback) {
      // Fallback is ONLY for the public read-only list when the DB is down/empty.
      // Admin CRUD must never operate against these objects (they have no real _id).
      rawProjects = fallbackProjects;
      usingFallback = true;
    }

    let repos: RepoSummary[] = [];
    try {
      repos = await getRepos();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[portfolio-api] GitHub enrichment unavailable for /api/projects: ${message}`);
    }

    const projects = rawProjects.map((project) =>
      toPublicProject(project, findRepo(project.repoNames || [project.name], repos))
    );

    res.json({
      source: repos.length > 0 ? "github+database" : "database",
      // isFallback tells the admin UI that these rows are NOT editable DB documents
      isFallback: usingFallback,
      projects,
    });
  })
);

// GET /api/projects/admin (Protected list, including hidden records)
projectsRouter.get(
  "/admin",
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const rawProjects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({
      source: "database",
      isFallback: false,
      projects: rawProjects.map((project) => toPublicProject(project)),
    });
  })
);

// GET /api/projects/:slug (Public single)
projectsRouter.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const storedProject = await Project.findOne({ slug }).lean();
    let project = storedProject?.isVisible === false ? null : storedProject;

    if (!storedProject) {
      const fallback = fallbackProjects.find((p) => p.slug === slug);
      if (!fallback) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      project = fallback as any;
    }

    let repos: RepoSummary[] = [];
    try {
      repos = await getRepos();
    } catch (_) {}

    res.json(toPublicProject(project, findRepo(project?.repoNames || [project?.name], repos)));
  })
);

// POST /api/projects (Protected - Create)
projectsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  })
);

// PATCH /api/projects/:id/visibility (Protected)
projectsRouter.patch(
  "/:id/visibility",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }
    if (typeof req.body?.isVisible !== "boolean") {
      res.status(400).json({ error: "isVisible must be a boolean" });
      return;
    }
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isVisible: req.body.isVisible },
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  })
);

// PUT /api/projects/:id (Protected - Update)
projectsRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  })
);

// DELETE /api/projects/:id (Protected - Delete)
projectsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ message: "Project deleted successfully" });
  })
);

// PATCH /api/projects/reorder (Protected - Reorder)
projectsRouter.patch(
  "/reorder",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { orders } = req.body; // Array of { id, order }
    if (!Array.isArray(orders)) {
      res.status(400).json({ error: "orders array is required" });
      return;
    }

    // Validate every id before running any updates
    const invalidIds = orders
      .map((item: { id: string; order: number }) => item.id)
      .filter((id) => !mongoose.isValidObjectId(id));

    if (invalidIds.length > 0) {
      res.status(400).json({ error: "Invalid project id(s) in reorder payload", ids: invalidIds });
      return;
    }

    const updates = orders.map((item: { id: string; order: number }) =>
      Project.findByIdAndUpdate(item.id, { order: item.order })
    );
    await Promise.all(updates);

    res.json({ message: "Projects reordered successfully" });
  })
);

// Export fallback list for use by the seed script
export { fallbackProjects };
