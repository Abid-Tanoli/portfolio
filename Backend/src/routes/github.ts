import { Router } from "express";
import { getEvents, getRepos, getUser } from "../services/githubService.js";
import { asyncHandler } from "./_helpers.js";

export const githubRouter = Router();

githubRouter.get(
  "/user",
  asyncHandler(async (_req, res) => {
    const user = await getUser();
    res.json(user);
  })
);

githubRouter.get(
  "/repos",
  asyncHandler(async (_req, res) => {
    const repos = await getRepos();
    res.json(repos);
  })
);

githubRouter.get(
  "/events",
  asyncHandler(async (_req, res) => {
    const events = await getEvents();
    res.json(events);
  })
);
