import type { NextFunction, Request, Response } from "express";

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
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  const status =
    err instanceof Error && err.name === "SyntaxError" && "body" in (err as Error & { body?: string })
      ? 400
      : 500;
  if (status === 400) {
    res.status(400).json({ error: "Malformed request body" });
    return;
  }
  console.error("[portfolio-api] unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
