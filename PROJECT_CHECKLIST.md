# PROJECT_CHECKLIST.md — Living checklist

Status legend: `[ ]` pending · `[~]` in progress · `[x]` done + verified (actually run/tested).

## Phase 1 — Research & analysis
- [x] Fetch GitHub user profile via REST API (12 repos, created 2024-06-21)
- [x] Fetch full repo list + descriptions/languages/stars/dates (12 repos enumerated)
- [x] Fetch READMEs for key repos (BQ-PLAY/CricAll, LowPriceMart, Event-Organizer, tourist-places-guide)
- [x] Attempt github-readme-stats.vercel.app → 503; fallback: compute stats server-side from API
- [x] Attempt Vercel dashboard enumeration → auth required; collected evidence from repo metadata (eventorganizer-five.vercel.app configured; cricall-user/cricall-admin documented)
- [x] Attempt Railway dashboard → auth required; identified as BQ-PLAY backend per CV/DEPLOYMENT.md
- [x] Write ANALYSIS.md
- [x] Gap analysis complete (photo/screenshots/certs placeholders; CV phrasing; finance narrative; repo-vs-CV expansion; testimonials empty state)

## Phase 2 — Plan
- [x] Write PLAN.md (revised: React frontend + Express backend per user decision)

## Phase 3 — Build
- [~] Scaffold monorepo (Frontend Vite + Backend Express, TS strict)
- [ ] Backend: Express app, health route, error middleware
- [ ] Backend: GitHub proxy service + disk cache (user/repos/events)
- [ ] Backend: projects merge endpoint
- [ ] Backend: contact route (Zod + Nodemailer SMTP)
- [ ] Frontend: Tailwind v4 theme tokens (dark/light) + globals
- [ ] Frontend: layout shell — Navbar, Footer, ThemeToggle, MobileNav, skip-link
- [ ] Frontend: Hero (typed subline, gradient blobs, parallax, CTAs, profile slot)
- [ ] Frontend: About (summary, highlights, goals) + UploadableImage
- [ ] Frontend: Skills grid (5 groups per taxonomy + Deployment)
- [ ] Frontend: Projects grid + filters + detail pages (merged data, status badges)
- [ ] Frontend: Experience + Education timelines (developer-first emphasis)
- [ ] Frontend: Certifications grid (5 certs, upload slots)
- [ ] Frontend: Resume route (PDF viewer + download)
- [ ] Frontend: Contact form + social rail (phone shown per user, LinkedIn placeholder pending URL)
- [ ] Frontend: Testimonials (honest empty state)
- [ ] Frontend: Achievements (verifiable facts only)
- [ ] Frontend: Stats counters (live counts, not guessed)
- [ ] Frontend: GitHub page (stats, top languages, recent activity heatmap)
- [ ] Frontend: Global animation pass (reveals, cursor, counters) + reduced-motion
- [ ] Frontend: Responsive pass (mobile/tablet/desktop, no h-scroll)
- [ ] Frontend: Accessibility pass (keyboard, contrast, aria, focus)
- [ ] Frontend: SEO pass (meta hook, sitemap, robots, JSON-LD, OG image)
- [ ] Frontend: Performance pass (code splitting, lazy images, Lighthouse ≥ 90 verified)
- [ ] Frontend: NotFound page + error boundary
- [ ] Root: git commits per section (conventional)
- [ ] Deploy backend to Railway (blocked on credentials — see DEPLOYMENT.md)
- [ ] Deploy frontend to Vercel (blocked on credentials — see DEPLOYMENT.md)
- [ ] Wire Vercel Analytics + Speed Insights
- [ ] Write DEPLOYMENT.md runbook

## Phase 5 — Resume
- [ ] Generate ATS-friendly resume.html from portfolio copy
- [ ] Render to content/resume.pdf (headless Edge print)
- [ ] Wire into /resume route

## Final QA
- [ ] Full end-to-end QA: all pages, both themes, 3 breakpoints, dev server logs clean
- [ ] Every item above confirmed [x], not [~]

## Blocked items (need human input)
- [ ] LinkedIn URL (user chose custom URL but no string provided) → placeholder slot in Contact
- [ ] Vercel CLI token / login → needed for final deployment
- [ ] Railway account access → verify backend service URL for badges
- [ ] SMTP credentials → wire live email sending (form already built against env vars)
