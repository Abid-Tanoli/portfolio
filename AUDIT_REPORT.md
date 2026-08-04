# AUDIT_REPORT.md — Phase 0 audit of existing work

Audited 2026-08-04 against the master continuation prompt. Code on disk is the source of truth.

## Summary

The portfolio was ~95% built in the prior session and is **production-buildable today**. Vite production build + prerender pass, backend typechecks and starts, MongoDB connects, all routes/sections exist. This session fixed the remaining gaps (rate limiting, a mojibake, an unused function, leftover `.bak`/`.tmp` files) and re-verified everything.

## Checklist → status

| Checklist item | Status | Notes |
|---|---|---|
| Frontend scaffold (Vite + React + TS strict + Tailwind v4 + shadcn-style ui + Framer-free CSS motion) | `[x]` | Build passes; `tsc -b` clean. Motion via CSS animations + custom hooks (no framer-motion dep — acceptable, documented in PLAN) |
| Backend scaffold (Express + TS) | `[x]` | Typechecks + builds + starts; Mongo driver with retry/backoff + DoH fallback |
| Layout shell (Navbar, Footer, ThemeToggle, MobileNav) | `[x]` | In `components/layout/` |
| Hero | `[x]` | Typewriter sublines, parallax gradient mesh, 3 CTAs, reduced-motion safe |
| About | `[x]` | 3-paragraph rewrite + highlights + career goals |
| Profile picture upload slot | `[x]` | `UploadableImage` with `AT` monogram placeholder |
| Skills | `[x]` | 5 taxonomy groups incl. Deployment |
| Projects grid + detail | `[x]` | Merged `github+curated` data via `/api/projects`; filters, prominence, status badges |
| Experience + Education timelines | `[x]` | Reverse-chron; tech roles visually emphasized |
| Certifications grid | `[x]` | 5 certs with upload slots |
| Resume route | `[x]` | PDF exists at `content/resume.pdf`, prerender fallback, download button |
| Contact form + `/api/contact` | `[x]` | RHF + Zod; Zod on backend too; rate limited (this session); SMTP send blocked on credentials |
| Testimonials empty state | `[x]` | Honest empty state, no fabricated quotes |
| Achievements | `[x]` | Verifiable facts only |
| Stats counters | `[x]` | 5 counters; GitHub count live via API |
| GitHub section | `[x]` | Profile card, top languages, top repos, activity heatmap, latest events — cached via backend |
| Global animation / reduced-motion | `[x]` | Hooks + linear-gradients pass; reduced-motion respected |
| Responsive pass | `[~]` | Responsive classes throughout; manual breakpoint QA not re-run this session |
| Accessibility pass | `[~]` | Skip-link, labels, aria, focus states present; full contrast/keyboard audit pending |
| SEO pass | `[x]` | `useSeo` meta hook, sitemap.xml, robots.txt, og-image, manifest, JSON-LD Person, per-page h1 |
| Performance | `[~]` | Route-level lazy loading + prerender + font preloads; Lighthouse not run |
| Backend hardening | `[x]` | CORS locked, JSON limit, error middleware, health route, rate limiting (added), env documented |
| Deployment (Vercel / Railway) | `[ ]` | **Blocked on user access** — repo to be created + credentials needed |
| Vercel Analytics + Speed Insights | `[ ]` | Needs deployed project |
| ATS resume PDF | `[x]` | `content/resume.html` + `resume.pdf` exist; copied into `public/` on build |
| E2E QA | `[~]` | Route smoke passed; full visual QA pending |

## Kept as-is (production quality)

- Backend `routes/`, `services/` (GitHub cache, mailer, db-with-DoH-fallback), middleware — well structured, no dead code.
- `UploadableImage` slot system, `useEnrichedProjects` fallback chain, prerender pipeline (Edge headless → per-route HTML), `vercel.json` rewrites.
- Data files (`data/profile.ts`, `data/projects.ts`) match the CV ground truth; honest narratives (B.Com "In Progress", no fake testimonials).

## Fixed this session

1. **Missing rate limiting** on `POST /api/contact` (brief Section 4) → added in-memory limiter (10 req / 15 min per IP) in `Backend/src/routes/contact.ts`.
2. **Mojibake** `â€”` in `Resume.tsx` meta description → `—`.
3. **Unused `findLatinFonts`** in `scripts/prerender.mjs` (lint warning) → removed.
4. **Leftover `package.json.bak`, `package.json.tmp`, `vite.config.ts.bak`, `Home.tsx.bak`** → deleted.

## Not blocking, but pending human input

- SMTP credentials (contact form sends 503 gracefully until then).
- LinkedIn URL (rail shows "URL coming soon").
- Vercel/Railway access for deployment.
- Custom domain vs default subdomains.