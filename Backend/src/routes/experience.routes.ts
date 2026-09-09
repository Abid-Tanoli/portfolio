import { Router, Request, Response } from "express";
import { Experience } from "../models/Experience.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const experienceRouter = Router();

// GET /api/experience (Public)
experienceRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Experience.find({ isVisible: { $ne: false } }).sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// GET /api/experience/admin (Protected list, including hidden records)
experienceRouter.get(
  "/admin",
  requireAuth,
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

// PATCH /api/experience/:id/visibility (Protected)
experienceRouter.patch(
  "/:id/visibility",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.body?.isVisible !== "boolean") {
      res.status(400).json({ error: "isVisible must be a boolean" });
      return;
    }
    const item = await Experience.findByIdAndUpdate(
      req.params.id,
      { isVisible: req.body.isVisible },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ error: "Experience record not found" });
      return;
    }
    res.json(item);
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
