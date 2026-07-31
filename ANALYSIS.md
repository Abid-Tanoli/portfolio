# ANALYSIS.md — Phase 1 Findings

Live-source audit for the Abid Ali Tanoli portfolio. Data fetched on 2026-07-31 via the GitHub REST API (unauthenticated, 60 req/hr limit), plus attempted Vercel/Railway dashboard scrapes.

## 1. GitHub Profile

- Login: `Abid-Tanoli` · Name: Abid Ali Tanoli · Account created: 2024-06-21
- Public repos: **12** · Followers: 1 · Following: 2
- Bio, blog, company, location: **not set** (opportunity: the portfolio links should drive profile completeness later)

## 2. GitHub Repos (12, sorted by last push)

| Repo | Lang | Stars | Last push | Description | Verdict |
|---|---|---|---|---|---|
| **LowPriceMart** | JavaScript | 0 | 2026-07-30 | Full-stack e-commerce: React 19 + Vite + Tailwind 4 + shadcn/ui + Redux Toolkit + Recharts; Node/Express 5 + MongoDB + JWT + Cloudinary + Nodemailer + Zod; Playwright e2e | **Feature** (most active) |
| **Event-Organizer** | TypeScript | 0 | 2026-07-22 | Event booking platform: React + TS + Node/Express + MongoDB, JWT auth, Vercel serverless entry; homepage configured `eventorganizer-five.vercel.app` but **returns 404 today** | **Feature**, live-link status pending verification |
| **tourist-places-guide** | JavaScript | 0 | 2026-07-15 | MERN tourist guide: React + Vite user/admin frontends + Express/Mongoose backend | **Feature** (in progress) |
| **BQ-PLAY** (CricAll) | JavaScript | 1 | 2026-07-03 | Flagship: live cricket scoring platform, MERN + Socket.IO, 25 user pages + 20 admin pages, 22 models, AI commentary (Anthropic Claude), RapidAPI/CricAPI/YouTube/RSS integrations, serverless-ready (vercel.json) | **Feature — flagship** |
| **Web-3-Bano-Qabil-Backend** | TypeScript | 0 | 2026-01-15 | Bano Qabil 4.0 backend coursework (Node/Express/TS) | Coursework |
| **ECommerce** | JavaScript | 0 | 2025-12-04 | Self-learning e-commerce exercise | Coursework |
| **Web-2-Bano-Qabil** | JavaScript | 0 | 2025-10-26 | Web Dev 2 assignments (logic building, arrays/objects) | Coursework |
| **Abid-Tanoli** | — | 0 | 2025-04-28 | GitHub profile config repo | Utility |
| **Final-Project-Web-dev-1** | CSS | 0 | 2024-10-01 | Bano Qabil web-dev-1 final project | Coursework |
| **assigment** | HTML | 1 | 2024-08-20 | Early coursework | Coursework |
| **Mid-Term_Web-dev-1** | CSS | 0 | 2024-08-20 | Mid-term coursework | Coursework |
| **subject** | — | 0 | 2024-06-30 | Empty/early repo | Coursework |

### Repo detail findings

- **BQ-PLAY** is actually branded **CricAll** in its README (project name evolved). README is high quality and complete: user frontend (25 pages), admin console (20 pages), backend (20+ route groups, 22 models), Socket.IO real-time, AI commentary via Anthropic Claude, DRS review system, super-over/tie resolution, wagon wheel/pitch maps. Deployment guide documents two Vercel projects (`cricall-user`, `cricall-admin`) plus a persistent Node backend (Railway/Render/Fly) — this matches the Railway project `5f8cde9b-6b77-4a1e-9985-8f86144bba13` cited in the brief.
- **LowPriceMart**: 3-tier structure (user frontend / admin frontend / backend) + Playwright e2e suite — strong engineering signal. No public deployment URL found.
- **Event-Organizer**: has `homepage: https://eventorganizer-five.vercel.app` in repo metadata, but the URL returns 404 (likely an API-only deployment whose root path doesn't serve, or the deployment was removed). **Must not claim "live demo"** — will show status badge "Verify deploy" / link to repo only, until confirmed.
- **README coverage**: BQ-PLAY, Event-Organizer, tourist-places-guide, LowPriceMart, Web-2-Bano-Qabil all have READMEs. Others don't — descriptions will be written honestly as coursework.

## 3. GitHub Stats (live sources)

- `github-readme-stats.vercel.app` returned **503** (service unavailable at fetch time) for both the stats card and top-languages card → **do not embed that service**; compute stats server-side from the REST API instead (total repos, total stars = 2, top languages, most recent activity). A custom SVG/canvas contribution heatmap will be rendered from our own cached event data (last ~90 days available unauthenticated), labeled honestly as "recent activity".
- Repo language mix: JavaScript, TypeScript, CSS, HTML.

## 4. Vercel

- Dashboard `https://vercel.com/abid-ali-tanolis-projects` requires authentication — **could not enumerate projects**. Confirmed evidence of Vercel usage: Event-Organizer `homepage` URL + BQ-PLAY's `vercel.json` + its DEPLOYMENT.md documenting `cricall-user` / `cricall-admin` projects.
- Action: portfolio deploys to Vercel; project cards link to live URLs **only where verified**; others get honest status labels. A Vercel CLI token from Abid is needed to fully enumerate/verify existing projects (flagged in checklist).

## 5. Railway

- Dashboard `https://railway.com/project/5f8cde9b-6b77-4a1e-9985-8f86144bba13` requires authentication — **could not scrape** service URL/status.
- Per CV + BQ-PLAY DEPLOYMENT.md, this is almost certainly the **BQ-PLAY backend** (persistent Node/Socket.IO service). Documented decision: keep the WebSocket backend on Railway (long-lived connections are a poor fit for Vercel serverless) and serve the frontends on Vercel. Badge renders only after Abid supplies the public service URL (flagged).

## 6. Gap Analysis (proactive fixes)

1. **No profile photo / project screenshots / cert scans** → `UploadableImage` component everywhere; drop files into `/content/images` post-launch with zero code changes.
2. **Raw CV informal phrasing** ("B.Com Not Completed", "Stuck in agrigation") → never shipped; reframed factually ("B.Com, University of Karachi — in progress").
3. **Finance history** → genuine differentiator, but secondary narrative: developer-first timeline with a distinct accent for tech roles; finance roles styled as supporting evidence (analytical rigor, ERP/MIS, reporting). No hiding, no headline placement.
4. **Only BQ-PLAY in CV, but 12 repos exist** → feature LowPriceMart, Event-Organizer, tourist-places-guide as primary project cards; group remaining coursework repos under a "Coursework" tab in Projects.
5. **No testimonials** → optional collapsible section with honest empty state ("Testimonials coming soon").
6. **LinkedIn URL** → user chose "custom URL" but no URL string was provided → render placeholder slot "LinkedIn URL pending" on Contact page; single-file change to wire in.
7. **Phone** → user chose to display publicly: +92 332-3178928 (also on resume).
8. **Email provider** → user chose **Nodemailer + SMTP**; `/api/contact` built against SMTP env vars; `.env.example` documents them; wiring requires Abid's SMTP credentials post-launch (or run locally with any SMTP).
9. **Domain** → default Vercel subdomain; custom domain note in DEPLOYMENT.md.
10. **Deployment verification** → Vercel CLI deploy from this machine requires Abid's token; if unavailable at the end of the session, the build verification + `vercel` CLI dry-run docs stand in, flagged explicitly as the one remaining human step.
