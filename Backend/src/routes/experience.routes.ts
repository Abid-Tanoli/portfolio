import { Router, Request, Response } from "express";
import { Experience } from "../models/Experience.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const experienceRouter = Router();

// GET /api/experience (Public)
experienceRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// POST /api/experience (Protected)
experienceRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Experience(req.body);
    await item.save();
    res.status(201).json(item);
  })
);

// PUT /api/experience/:id (Protected)
experienceRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ error: "Experience record not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/experience/:id (Protected)
experienceRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Experience record not found" });
      return;
    }
    res.json({ message: "Experience record deleted" });
  })
);
