# PLAN.md — Portfolio Architecture

## 0. Revised architecture (user decision, 2026-07-31)

> **User requirement:** the portfolio project itself must follow the MERN-style pattern used in the author's existing work: a **React frontend** and a **Node.js + Express backend** — not a Next.js App Router monolith.

This plan supersedes the Next.js-only structure from the original brief. Everything else (design system, content model, quality bars) carries over unchanged.

## 1. Repository layout (monorepo)

```
portfolio/                       # git root
├── Frontend/                    # React 19 + Vite 7 + TypeScript (strict)
│   ├── public/                  # favicon, og-image, manifest, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer, ThemeToggle, MobileNav
│   │   │   ├── sections/        # Hero, About, SkillsGrid, ProjectsGrid, ExperienceTimeline,
│   │   │   │                    # EducationTimeline, CertificationsGrid, Testimonials,
│   │   │   │                    # AchievementsGrid, StatsCounter, GithubPanel, ContactForm
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── project/         # ProjectCard, ProjectBadges, ProjectGallery, TechStackPills
│   │   │   └── shared/          # SectionHeading, AnimatedCounter, GlassCard, GradientBlob,
│   │   │                        # ScrollReveal, Cursor, UploadableImage, ErrorBoundary
│   │   ├── pages/               # Home, About, Projects, ProjectDetail, Certifications,
│   │   │                        # Resume, Contact, Github, NotFound
│   │   ├── lib/                 # api.ts, seo.ts (meta hook), utils.ts, constants.ts, cache.ts
│   │   ├── data/                # typed content: experience, education, skills, certs, projects
│   │   ├── hooks/               # useReducedMotion, useScrollReveal, useMediaQuery, useSeo
│   │   ├── types/               # project.ts, experience.ts, certification.ts, github.ts
│   │   ├── App.tsx              # React Router routes + layout
│   │   ├── main.tsx
│   │   └── index.css            # Tailwind v4 theme tokens (CSS-first)
│   ├── vercel.json              # SPA fallback rewrite (matches author's existing pattern)
│   └── vite.config.ts           # @tailwindcss/vite, react, path alias, proxy → backend
├── Backend/                     # Node.js + Express 5 + TypeScript
│   ├── src/
│   │   ├── index.ts             # app bootstrap + error handling
│   │   ├── app.ts               # express app, cors, json, routes
│   │   ├── routes/
│   │   │   ├── github.ts        # GET /api/github/user, /repos, /events (cached proxy)
│   │   │   ├── projects.ts      # GET /api/projects (merged dataset)
│   │   │   └── contact.ts       # POST /api/contact (Nodemailer + SMTP)
│   │   ├── services/
│   │   │   ├── githubService.ts # GitHub REST client + on-disk JSON cache + revalidation
│   │   │   └── mailer.ts        # Nodemailer transport (SMTP env vars)
│   │   └── middleware/error.ts  # centralized error handler (no stack leaks)
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json             # express, cors, nodemailer, dotenv; dev: tsx watch
│   └── Dockerfile               # Railway-ready (optional; Nixpacks also works)
├── content/
│   ├── resume.pdf               # Phase 5 ATS resume (generated)
│   ├── resume.html              # source document for PDF generation
│   └── images/                  # profile.jpg, project screenshots, cert scans (drop-in)
├── ANALYSIS.md                  # Phase 1 findings
├── PLAN.md                      # this file
├── DEPLOYMENT.md                # runbook (Vercel + Railway + SMTP)
├── PROJECT_CHECKLIST.md         # living checklist
├── package.json                 # root scripts (dev/build for both workspaces)
└── .gitignore
```

**Backend dependency policy** (per brief: no gratuitous deps): Express + cors + dotenv + nodemailer only. No ORM/DB — the portfolio backend's job is the contact form + cached GitHub API proxy; a database would be an unjustified dependency. Documented here as a deliberate decision.

## 2. Routes (React Router v7, SPA with hash-free BrowserRouter)

| Route | Page |
|---|---|
| `/` | Home (Hero, About preview, Skills preview, Featured Projects, Stats, CTA) |
| `/about` | Full About + Experience + Education timelines |
| `/projects` | All projects, filter by category/tech, sort by recency |
| `/projects/:slug` | Project deep-dive (features, stack, links, status) |
| `/certifications` | Certification gallery |
| `/resume` | Embedded PDF viewer + download |
| `/contact` | Contact form + social rail |
| `/github` | Stats, top languages, recent activity heatmap |
| `*` | NotFound (with link home) |

## 3. Backend API

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Liveness probe (Railway) |
| `GET /api/github/user` | Cached GitHub profile |
| `GET /api/github/repos` | Cached repo list (enriched with README-derived descriptions where GitHub description is null) |
| `GET /api/github/events` | Recent public activity (last ~90 days, unauthenticated limit) |
| `GET /api/projects` | Merged project dataset (static curation + live enrichment) |
| `POST /api/contact` | Zod-validated form → Nodemailer SMTP |

GitHub proxy cache: JSON files in `Backend/.cache/`, TTL 60 min for repos/events, 30 min user. Optional `GITHUB_TOKEN` env raises rate limit from 60→5000 req/hr. This is why the frontend never talks to GitHub directly: no CORS, no rate-limit blowups, one cache point.

## 4. Data flow

- All editorial content (experience, education, certifications, skills, achievements) lives in typed files under `Frontend/src/data/` — never inline in JSX.
- Projects: `Frontend/src/data/projects.ts` (curated: slug, description, features, links, status) merged client-side with live data from `GET /api/projects` (which itself merges GitHub repo stats at the backend). Frontend cache: sessionStorage + React Query-style minimal hook (SWR-less; see deps justification).
- `UploadableImage` component: renders a real image if the file exists in `/content/images`, else a branded placeholder with an "Add image" hint. Deterministic mapping: `profile → profile.jpg`, `project:<slug> → projects/<slug>.png`, `cert:<id> → certs/<id>.jpg`. (Frontend build copies `content/images` into `public` via a small prebuild script.)

## 5. Visual design system

- **Theme**: dark-first premium SaaS aesthetic (Linear/Vercel/Stripe-inspired), full light mode, persistent toggle, system-aware default. Tokens via Tailwind v4 `@theme` — never hardcoded hex in components.
- **Palette**: base `#08090B` (dark) / `#FAFAFA` (light); accent gradient `#6366F1 → #22D3EE` (indigo→cyan); sparse amber `#F59E0B` for badges; neutral gray scale for text hierarchy.
- **Typography**: Geist Sans for headings (tight tracking), Inter for body, JetBrains Mono for code/stats/pills. Google Fonts via `@fontsource` packages (self-hosted → no third-party requests, better perf/privacy).
- **Surfaces**: glassmorphism cards (backdrop-blur + translucent border), soft layered shadows, `--radius: 1rem` scale.
- **Motion**: Framer Motion — scroll reveal, staggered grids, hover-lift, magnetic CTAs, animated counters, custom cursor (desktop only, pointer:fine media query), Hero parallax on background layer only. `prefers-reduced-motion` respected everywhere.

## 6. Performance strategy (SPA version of the brief's targets)

- Code splitting: `React.lazy` per route + `React.memo` where props-stable.
- Fonts: self-hosted `@fontsource` subsets; `font-display: swap`.
- Images: `loading="lazy"` + explicit `width`/`height` (no CLS), AVIF/WebP when present, else optimized PNG/JPEG at reasonable sizes.
- Heavy components (heatmap, cursor) dynamically imported.
- Bundle: Vite `manualChunks` for vendor splitting; keep initial JS lean.
- Measure: `vite build` output sizes + Lighthouse (Edge headless) before declaring the perf item done — not by assumption.

## 7. SEO strategy (SPA-appropriate)

- Static `public/sitemap.xml` + `public/robots.txt` (generated by script from the route list).
- `public/og-image.png` generated once via headless Edge screenshot of an SVG source.
- Per-page `<title>`/description/OG via a `useSeo()` hook (updates document head on route change; SPA equivalent of the Metadata API).
- JSON-LD Person + WebSite injected on Home (script tag).
- Semantic HTML: one `h1` per page, landmarks (`header/main/footer/nav`), descriptive alt text everywhere.

## 8. Accessibility

WCAG 2.1 AA: full keyboard nav (incl. cursor disabled when `(hover: none)` or reduced motion), visible focus rings, aria-labels on icon buttons, labeled form fields + inline errors, skip-to-content link, reduced-motion fallbacks, 44px tap targets, no horizontal scroll at any breakpoint.

## 9. Deployment strategy

- **Frontend** → Vercel (static SPA + `vercel.json` rewrite for deep links — same pattern as the author's existing `cricall-user`/`cricall-admin` projects).
- **Backend** → Railway (persistent Node service; consistent with the author's existing Railway usage and keeps SMTP/github-cache state simple). Documented in DEPLOYMENT.md.
- `Frontend/.env` needs `VITE_API_URL` → backend URL (dev: Vite proxy → `http://localhost:4000`).
- `Backend/.env.example` documents `PORT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO`, `GITHUB_TOKEN` (optional).
- Vercel Analytics + Speed Insights planned for the frontend.

## 10. Dependencies added beyond the brief's Next.js list — justification

| Package | Why |
|---|---|
| `react-router-dom` | Required by the React frontend decision (replaces App Router) |
| `@fontsource/*` | Self-hosted fonts (perf/privacy) |
| `express`, `cors`, `nodemailer`, `dotenv` | Backend per user decision |
| `concurrently` (root) | One-command dev |
| Everything else (framer-motion, zod, react-hook-form, @hookform/resolvers, lucide-react, shadcn/ui, tailwind) | From the original brief |

No SWR/React Query: the API surface is tiny; a typed `fetchData` helper + `useEffect` hook with sessionStorage cache covers it without a dependency.
