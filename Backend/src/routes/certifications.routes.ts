import { Router, Request, Response } from "express";
import { Certification } from "../models/Certification.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const certificationsRouter = Router();

// GET /api/certifications (Public)
certificationsRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Certification.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// POST /api/certifications (Protected)
certificationsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Certification(req.body);
    await item.save();
    res.status(201).json(item);
  })
);

// PUT /api/certifications/:id (Protected)
certificationsRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ error: "Certification not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/certifications/:id (Protected)
certificationsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Certification.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Certification not found" });
      return;
    }
    res.json({ message: "Certification deleted" });
  })
);
