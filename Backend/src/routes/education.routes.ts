import { Router, Request, Response } from "express";
import { Education } from "../models/Education.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const educationRouter = Router();

// GET /api/education (Public)
educationRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Education.find({ isVisible: { $ne: false } }).sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// GET /api/education/admin (Protected list, including hidden records)
educationRouter.get(
  "/admin",
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// POST /api/education (Protected)
educationRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Education(req.body);
    await item.save();
    res.status(201).json(item);
  })
);

// PATCH /api/education/:id/visibility (Protected)
educationRouter.patch(
  "/:id/visibility",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.body?.isVisible !== "boolean") {
      res.status(400).json({ error: "isVisible must be a boolean" });
      return;
    }
    const item = await Education.findByIdAndUpdate(
      req.params.id,
      { isVisible: req.body.isVisible },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ error: "Education record not found" });
      return;
    }
    res.json(item);
  })
);

// PUT /api/education/:id (Protected)
educationRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ error: "Education record not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/education/:id (Protected)
educationRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Education record not found" });
      return;
    }
    res.json({ message: "Education record deleted" });
  })
);
