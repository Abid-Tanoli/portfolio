import { Router, Request, Response } from "express";
import { Testimonial } from "../models/Testimonial.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const testimonialsRouter = Router();

// GET /api/testimonials (Public - only returns approved testimonials)
testimonialsRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Testimonial.find({ approved: true, isVisible: { $ne: false } }).sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// GET /api/testimonials/all (Protected - returns all including pending approval)
testimonialsRouter.get(
  "/all",
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  })
);

// POST /api/testimonials (Protected)
testimonialsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Testimonial(req.body);
    await item.save();
    res.status(201).json(item);
  })
);

// PATCH /api/testimonials/:id/visibility (Protected)
testimonialsRouter.patch(
  "/:id/visibility",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.body?.isVisible !== "boolean") {
      res.status(400).json({ error: "isVisible must be a boolean" });
      return;
    }
    const item = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isVisible: req.body.isVisible },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json(item);
  })
);

// PUT /api/testimonials/:id (Protected)
testimonialsRouter.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/testimonials/:id (Protected)
testimonialsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json({ message: "Testimonial deleted" });
  })
);
