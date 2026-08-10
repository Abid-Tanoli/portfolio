import { Router, Request, Response } from "express";
import { Profile } from "../models/Profile.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "./_helpers.js";

export const profileRouter = Router();

const defaultProfile = {
  name: "Abid Ali Tanoli",
  firstName: "Abid",
  title: "Full Stack Web Developer (MERN)",
  tagline: "MERN · AI-Augmented Development · REST APIs · Financial Analysis",
  email: "visionaryabidi@gmail.com",
  phone: "+92 332-3178928",
  phoneDisplay: "+92 332 3178928",
  location: "Karachi, Pakistan",
  github: "https://github.com/Abid-Tanoli",
  githubUsername: "Abid-Tanoli",
  linkedin: "",
  linkedinPending: true,
  resumeUrl: "/resume.pdf",
  profilePictureUrl: "",
  heroSublines: [
    "MERN Stack Developer",
    "AI-Augmented Development",
    "REST API Design",
    "Financial Analysis",
  ],
  heroSummary:
    "Full Stack Web Developer building real products with the MERN stack — and a growing specialization in AI-augmented development, using tools like Antigravity, Codex, Qwen, and OpenCode to ship faster and smarter. Currently building BQ-PLAY, a live cricket scoring platform, at Bano Qabil Incubation Center.",
  aboutSummary: [
    "I'm a Full Stack Web Developer with hands-on MERN expertise — MongoDB, Express.js, React.js, and Node.js — and a fast-growing specialization in AI-augmented development.",
    "I'm currently an intern at Bano Qabil Incubation Center, where I'm building BQ-PLAY.",
    "What sets me apart: 8+ years of professional experience in Accounting & Finance.",
  ],
  careerGoals:
    "I'm on a trajectory from full stack development to AI-augmented engineering.",
};

// GET /api/profile (Public)
profileRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    let profileData = await Profile.findOne();
    if (!profileData) {
      res.json(defaultProfile);
      return;
    }
    res.json(profileData);
  })
);

// PUT /api/profile (Protected)
profileRouter.put(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    let profileData = await Profile.findOne();
    if (!profileData) {
      profileData = new Profile(req.body);
    } else {
      Object.assign(profileData, req.body);
    }
    await profileData.save();
    res.json(profileData);
  })
);
