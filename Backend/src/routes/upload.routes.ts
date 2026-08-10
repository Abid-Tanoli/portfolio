import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";
import { uploadToCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { asyncHandler } from "./_helpers.js";

export const uploadRouter = Router();

// POST /api/upload (Protected)
uploadRouter.post(
  "/",
  requireAuth,
  uploadMiddleware.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    if (!isCloudinaryConfigured()) {
      // Dev fallback: convert buffer to base64 Data URI so uploading still works locally
      const b64 = req.file.buffer.toString("base64");
      const mime = req.file.mimetype;
      const dataUri = `data:${mime};base64,${b64}`;
      res.json({
        url: dataUri,
        publicId: `local-${Date.now()}`,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        warning: "Cloudinary credentials missing. Serving as base64 Data URI in local dev.",
      });
      return;
    }

    const folder = (req.body.folder as string) || "portfolio";
    const resourceType = req.file.mimetype === "application/pdf" ? "raw" : "image";

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder,
        resourceType,
        filename: req.file.originalname,
      });

      res.json({
        url: result.url,
        publicId: result.publicId,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[upload] Cloudinary upload error:", msg);
      res.status(500).json({ error: `Upload failed: ${msg}` });
    }
  })
);
