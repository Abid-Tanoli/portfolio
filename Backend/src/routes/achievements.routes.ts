import { Router, Request, Response } from "express";
import { Achievement } from "../models/Achievement.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const achievementsRouter = Router();

// GET /api/achievements (Public)
achievementsRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// POST /api/achievements (Protected)
achievementsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Achievement(req.body);
    await item.save();
    res.status(201).json(item);
  })
);

// PUT /api/achievements/:id (Protected)
achievementsRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ error: "Achievement not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/achievements/:id (Protected)
achievementsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Achievement.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Achievement not found" });
      return;
    }
    res.json({ message: "Achievement deleted" });
  })
);
