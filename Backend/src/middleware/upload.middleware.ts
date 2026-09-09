import multer from "multer";
import { Request } from "express";
import { AppError } from "./error.js";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    // SVG intentionally excluded: SVG files can carry embedded <script> tags and
    // event-handler attributes, creating a stored-XSS vector if ever served inline.
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type: ${file.mimetype}. Only images (JPG, PNG, WebP, GIF) and PDFs are allowed.`, 400));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});
