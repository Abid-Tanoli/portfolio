import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { regenerateResume } from "../services/resumeService.js";
import { asyncHandler } from "./_helpers.js";

export const resumeRouter = Router();

// POST /api/resume/regenerate (Protected) — rebuild the PDF from site data and republish it
resumeRouter.post(
  "/regenerate",
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const result = await regenerateResume();
    res.json(result);
  })
);