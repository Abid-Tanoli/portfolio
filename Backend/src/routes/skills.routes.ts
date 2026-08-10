import { Router, Request, Response } from "express";
import { Skill } from "../models/Skill.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const skillsRouter = Router();

// GET /api/skills (Public - returns flat list + grouped taxonomy)
skillsRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Skill.find().sort({ order: 1, createdAt: 1 });
    
    // Taxonomy metadata for groups
    const categoriesMeta: Record<string, { title: string; description: string }> = {
      frontend: { title: "Frontend", description: "Building responsive, accessible interfaces" },
      backend: { title: "Backend & Database", description: "APIs, auth, and data modeling" },
      ai: { title: "AI-Augmented Development", description: "Shipping faster with AI agents in the loop" },
      deployment: { title: "Deployment & DevOps", description: "From localhost to production" },
      tools: { title: "Tools & Workflow", description: "The daily toolkit" },
    };

    const groupedMap = new Map<string, string[]>();

    list.forEach((s) => {
      if (!groupedMap.has(s.category)) groupedMap.set(s.category, []);
      groupedMap.get(s.category)!.push(s.name);
    });

    const groups = Object.keys(categoriesMeta).map((catKey) => ({
      id: catKey,
      title: categoriesMeta[catKey].title,
      description: categoriesMeta[catKey].description,
      skills: groupedMap.get(catKey) || [],
    }));

    res.json({ skills: list, groups });
  })
);

// POST /api/skills (Protected)
skillsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Skill(req.body);
    await item.save();
    res.status(201).json(item);
  })
);

// PUT /api/skills/:id (Protected)
skillsRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/skills/:id (Protected)
skillsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }
    res.json({ message: "Skill deleted" });
  })
);
