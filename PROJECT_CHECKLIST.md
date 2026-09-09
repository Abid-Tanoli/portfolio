# PROJECT_CHECKLIST.md - Living checklist

> Superseded — this project is now deployed on a VPS; see DEPLOYMENT.md for the current setup.

Status legend: `[ ]` pending | `[~]` in progress / partially verified | `[x]` done + verified.

Last verification pass: 2026-08-04

## Phase 1 - Research & analysis
- [x] Fetch GitHub user profile via REST API (12 repos, created 2024-06-21)
- [x] Fetch full repo list + descriptions/languages/stars/dates (12 repos enumerated)
- [x] Fetch READMEs for key repos (BQ-PLAY/CricAll, LowPriceMart, Event-Organizer, tourist-places-guide)
- [x] Attempt github-readme-stats.vercel.app -> 503; fallback: compute stats server-side from API
- [x] Attempt Vercel dashboard enumeration -> auth required; collected evidence from repo metadata
- [x] Attempt Railway dashboard -> auth required; identified as BQ-PLAY backend from available evidence
- [x] Write ANALYSIS.md
- [x] Complete gap analysis: photo/screenshots/certs placeholders, CV phrasing, finance narrative, repo expansion, testimonials empty state

## Phase 2 - Plan
- [x] Write PLAN.md with revised architecture: React/Vite frontend + Node/Express backend

## Phase 3 - Build
- [x] Scaffold monorepo: Frontend Vite + Backend Express, TypeScript strict (verified by frontend build + backend typecheck)
- [x] Backend: Express app, health route, CORS, JSON parsing, not-found and error middleware
- [x] Backend: GitHub proxy service + disk cache for user/repos/events
- [x] Backend: projects merge endpoint at `GET /api/projects` (verified by local API smoke; returned `github+curated`)
- [~] Backend: contact route with Zod + Nodemailer SMTP (implemented + rate-limited; live sending blocked by SMTP credentials)
- [x] Backend: rate limiting on `/api/contact` (in-memory, 10 req / 15 min per IP)
- [x] Frontend: Tailwind v4 theme tokens, dark/light globals, self-hosted fonts
- [x] Frontend: layout shell - Navbar, Footer, ThemeToggle, MobileNav, skip-link
- [x] Frontend: Hero with CTAs, animated subline, profile slot, reduced-motion support
- [x] Frontend: About summary, highlights, career goals, UploadableImage profile slot
- [x] Frontend: Skills grid with taxonomy groups plus Deployment
- [x] Frontend: Projects grid + detail pages, status badges, GitHub-enriched project data
- [x] Frontend: Experience + Education timelines with developer-first emphasis
- [x] Frontend: Certifications grid with upload slots
- [x] Frontend: Resume route with embedded PDF/download (resume asset copy fixed and smoke-tested)
- [x] Frontend: Contact form + social rail with LinkedIn pending state
- [x] Frontend: Testimonials honest empty state
- [x] Frontend: Achievements from verifiable facts
- [x] Frontend: Stats counters using curated + GitHub-backed counts
- [x] Frontend: GitHub page with profile stats, top languages, top repos, activity heatmap/feed
- [x] Frontend: Global animation pass: scroll reveals, counters, cursor, reduced-motion handling
- [~] Frontend: Responsive pass (routes smoke-tested; manual breakpoint visual QA still pending)
- [~] Frontend: Accessibility pass (semantic/labeled UI present; full keyboard/contrast audit still pending)
- [x] Frontend: SEO pass - meta hook, sitemap, robots, JSON-LD, OG image assets
- [~] Frontend: Performance pass (production build/prerender verified; Lighthouse >= 90 still pending)
- [x] Frontend: NotFound page + ErrorBoundary
- [x] Root: DEPLOYMENT.md runbook added
- [ ] Deploy backend to Railway (blocked on Railway access/service URL)
- [ ] Deploy frontend to Vercel (blocked on Vercel login/token)
- [ ] Wire Vercel Analytics + Speed Insights

## Phase 5 - Resume
- [x] Generate ATS-friendly resume.html from portfolio copy (content/resume.html exists)
- [x] Render resume PDF to content/resume.pdf (file exists and is copied into Frontend/public during build)
- [x] Wire resume PDF into /resume route (verified by browser smoke)

## Verification Completed
- [x] `npm run typecheck --prefix Backend` passed (2026-08-04)
- [x] Backend live smoke passed 2026-08-04: `/api/health` (db connected), `/api/projects`, `/api/github/user`, `/api/contact` (503 when SMTP unconfigured)
- [x] `npm run build` passed, including Vite production build and prerender
- [x] Lint clean (only fast-refresh dev warnings)
- [x] Browser smoke passed for `/`, `/about`, `/projects`, project detail routes, `/certifications`, `/resume`, `/github`, `/contact`, and 404

## Final QA
- [~] Full end-to-end QA: route smoke passed; manual mobile/tablet/desktop/theme QA still pending
- [ ] Lighthouse Performance/Accessibility/Best Practices/SEO >= 90 verified
- [ ] Production deployment URLs verified
- [ ] Every non-blocked checklist item confirmed `[x]`

## Blocked items needing human input
- [ ] LinkedIn URL
- [ ] Vercel CLI token / login for frontend deployment
- [ ] Railway account access / backend public URL confirmation
- [ ] SMTP credentials for live contact form sending
- [ ] Vercel Analytics + Speed Insights decision/account access
