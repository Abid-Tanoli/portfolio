import express from "express";
import cors from "cors";
import { githubRouter } from "./routes/github.js";
import { contactRouter } from "./routes/contact.js";
import { projectsRouter } from "./routes/projects.js";
import { authRouter } from "./routes/auth.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { profileRouter } from "./routes/profile.routes.js";
import { experienceRouter } from "./routes/experience.routes.js";
import { educationRouter } from "./routes/education.routes.js";
import { skillsRouter } from "./routes/skills.routes.js";
import { certificationsRouter } from "./routes/certifications.routes.js";
import { achievementsRouter } from "./routes/achievements.routes.js";
import { testimonialsRouter } from "./routes/testimonials.routes.js";
import { contactSubmissionsRouter } from "./routes/contact-submissions.routes.js";
import { resumeRouter } from "./routes/resume.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { isDbConnected } from "./services/db.js";

export const app = express();

app.disable("x-powered-by");

const allowedOrigins = (
  process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or if in allowedOrigins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: isDbConnected() ? "connected" : "not-connected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/profile", profileRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/education", educationRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/certifications", certificationsRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/contact-submissions", contactSubmissionsRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/contact", contactRouter);
app.use("/api/github", githubRouter);

app.use(notFoundHandler);
app.use(errorHandler);
