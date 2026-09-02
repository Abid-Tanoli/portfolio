import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AdminPayload {
  adminId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("[auth] JWT_SECRET is not set — refusing to operate without a secure secret");
  }
  return secret;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminPayload;
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}
