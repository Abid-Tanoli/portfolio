import express from "express";
import cors from "cors";
import { githubRouter } from "./routes/github.js";
import { contactRouter } from "./routes/contact.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { isDbConnected } from "./services/db.js";

export const app = express();

app.disable("x-powered-by");

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: isDbConnected() ? "connected" : "not-connected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/github", githubRouter);
app.use("/api/contact", contactRouter);

app.use(notFoundHandler);
app.use(errorHandler);
