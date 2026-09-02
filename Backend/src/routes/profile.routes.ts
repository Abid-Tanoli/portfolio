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
  resumeUrl: "",
  resumeSummary:
    "Full Stack Web Developer with hands-on MERN expertise (MongoDB, Express.js, React.js, Node.js) and a growing specialization in AI-augmented development — integrating tools such as Antigravity, OpenAI Codex, Qwen, and OpenCode into real production workflows. Currently an intern at Bano Qabil Incubation Center, building BQ-PLAY, a live cricket scoring platform with real-time updates. A complementary 10+ year background in Accounting & Finance — including receivable management supervision — brings analytical rigor, structured problem-solving, and financial reporting discipline to every engineering decision.",
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
    "I'm a Full Stack Web Developer with hands-on MERN expertise — MongoDB, Express.js, React.js, and Node.js — and a fast-growing specialization in AI-augmented development. I integrate modern AI coding tools (Antigravity, OpenAI Codex, Qwen, OpenCode) directly into my workflow to design, build, and debug features faster without compromising quality.",
    "I'm currently an intern at Bano Qabil Incubation Center, where I'm building BQ-PLAY — a live cricket scoring platform with real-time updates, an admin scoring console, and player statistics. I work in an agile team with Git/GitHub, design REST APIs and MongoDB schemas, and ship responsive React frontends end-to-end.",
    "What sets me apart: 8+ years of professional experience in Accounting & Finance. I've built financial MIS dashboards, managed receivables across South Pakistan, and filed tax reports — so I bring analytical rigor, structured problem-solving, and a business mindset to every engineering decision.",
  ],
  careerGoals:
    "I'm on a trajectory from full stack development to AI-augmented engineering: building tools that combine the MERN stack with AI agents, prompt-driven workflows, and real-time systems — while keeping the financial discipline and analytical rigor I've carried from a decade in accounting.",
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
