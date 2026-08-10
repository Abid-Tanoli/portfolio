import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";
import { signToken, requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const admin = await Admin.findOne({ email: String(email).toLowerCase() });
    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ adminId: admin._id.toString(), email: admin.email });
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  })
);

// POST /api/auth/change-password (Protected)
authRouter.post(
  "/change-password",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: "oldPassword and newPassword are required" });
      return;
    }

    if (String(newPassword).length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters long" });
      return;
    }

    const admin = await Admin.findById(req.admin?.adminId);
    if (!admin) {
      res.status(404).json({ error: "Admin account not found" });
      return;
    }

    const isValid = await bcrypt.compare(String(oldPassword), admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(String(newPassword), salt);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  })
);

// GET /api/auth/me (Protected) - Verify current token
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ admin: req.admin });
  })
);
