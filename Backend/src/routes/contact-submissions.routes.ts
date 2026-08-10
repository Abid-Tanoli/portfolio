import { Router, Request, Response } from "express";
import { ContactSubmission } from "../models/ContactSubmission.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const contactSubmissionsRouter = Router();

// GET /api/contact-submissions (Protected)
contactSubmissionsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const skip = (page - 1) * limit;

    const [items, total, unread] = await Promise.all([
      ContactSubmission.find().sort({ submittedAt: -1 }).skip(skip).limit(limit),
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ read: false }),
    ]);

    res.json({
      submissions: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unread,
    });
  })
);

// GET /api/contact-submissions/unread-count (Protected)
contactSubmissionsRouter.get(
  "/unread-count",
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const unread = await ContactSubmission.countDocuments({ read: false });
    res.json({ unread });
  })
);

// PATCH /api/contact-submissions/:id/read (Protected)
contactSubmissionsRouter.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!item) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    res.json(item);
  })
);

// DELETE /api/contact-submissions/:id (Protected)
contactSubmissionsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    res.json({ message: "Submission deleted" });
  })
);
