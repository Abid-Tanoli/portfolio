import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known application error with an explicit HTTP status
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Malformed JSON body (SyntaxError injected by express.json())
  if (
    err instanceof SyntaxError &&
    "body" in (err as SyntaxError & { body?: unknown })
  ) {
    res.status(400).json({ error: "Malformed request body" });
    return;
  }

  // Mongoose CastError — invalid ObjectId or type mismatch
  if (err instanceof mongoose.Error.CastError) {
    res
      .status(400)
      .json({ error: `Invalid value for field "${err.path}": ${err.value}` });
    return;
  }

  // Mongoose ValidationError — schema-level validation failed
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ error: "Validation failed", details: messages });
    return;
  }

  // Unexpected server error — always log the full stack
  console.error("[portfolio-api] unhandled error:", err);

  const isDev = process.env.NODE_ENV !== "production";
  const message =
    isDev && err instanceof Error ? err.message : "Internal server error";

  res.status(500).json({ error: message });
}
