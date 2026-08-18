# PROGRESS.md — Portfolio Project

Repo: Portfolio · Branch: main · Updated: 2026-08-18

## Step 1 — CLEANUP
- **Status:** DONE · 100% of step · **Overall: 17% (1/6)**
- Removed 89 tracked legacy files under `Frontend/` (src/, public/, scripts/, index.html, package.json, tsconfig*, vercel.json, etc.) plus untracked `Frontend/dist`, `Frontend/node_modules`, `Frontend/public` — only `Frontend/User/` and `Frontend/admin/` remain.
- Deleted stray log files; `*.log` gitignored across root, Backend, Frontend/User, and Frontend/admin.
- Removed duplicate root `Portfolio.pdf` — kept `content/portfolio.pdf` as source of truth for assets copy.
- Verified `Backend/.env` is NOT tracked in git and remains in `.gitignore`.
- Removed empty `mongo.md`.

## Step 2 — WIRE ADMIN PANEL (Router + Login + Navigation)
- **Status:** DONE · 100% of step · **Overall: 33% (2/6)**
- Set up React Router in `Frontend/admin/src/App.tsx` & `main.tsx`:
  - Public: `/login` → LoginPage.
  - Protected: `/` → `/dashboard`, `/profile`, `/projects`, `/experience`, `/education`, `/skills`, `/certifications`, `/testimonials`, `/achievements`, `/contact-submissions`, `/resume`.
- Rewired `AdminSidebar` with active states and direct links for all CMS sections.
- Auto-logout on token expiry with SessionExpiryWatcher and visible banner on `/login?expired=1`.
- Added SPA rewrites to `Frontend/admin/vercel.json`.

## Step 3 — RESUME / CV MANAGEMENT
- **Status:** DONE · 100% of step · **Overall: 50% (3/6)**
- Implemented **Option A (Structured/Editable PDF generation with fallback to direct upload)**:
  - Backend `resumeService.ts`: Puppeteer renders ATS-friendly PDF from live MongoDB profile/experience/skills/education/certs/projects and uploads to Cloudinary (or base64 fallback in dev).
  - Protected API: `POST /api/resume/regenerate`.
  - Admin `ResumeManager.tsx`: one-click "Regenerate PDF from site data" + manual PDF upload via Cloudinary, with instant status feedback.
  - Public User site `/resume`: dynamically fetches `profile.resumeUrl` and presents download/preview without hardcoded local files.

## Step 4 — FULL ADMIN CONTROL VERIFICATION
- **Status:** DONE · 100% of step · **Overall: 67% (4/6)**
- Verified all models and endpoints:
  - Profile: name, title, contact info, summaries, bio, resume URL.
  - Projects: CRUD + featured toggle + status + stack + features + repo links.
  - Skills: CRUD + categories (frontend, backend, ai, deployment, tools) + order.
  - Experience: CRUD + tech/finance classification + highlights.
  - Education: CRUD + degrees + institutions + period.
  - Certifications: CRUD + image upload + issuer + batch.
  - Achievements: CRUD + icon selector + details.
  - Testimonials: CRUD + approval status (public filtering).
  - Contact Submissions: Paginated list + unread badges + mark-as-read + delete.
  - Resume: Live regeneration + custom PDF upload + delete.
- Fixed `CrudPage.tsx` load handler to seamlessly normalize both array and wrapped `{ skills, groups }` / `{ projects }` API payloads.

## Step 5 — REMOVE HARDCODED CONTENT
- **Status:** DONE · 100% of step · **Overall: 83% (5/6)**
- `ProjectDetail.tsx`: removed static-list slug gating so dynamically added projects via CMS are accessible immediately.
- `Hero.tsx`: dynamically renders `profile.title` from API instead of hardcoded string.
- `ProjectsGrid.tsx`: category tabs now compute counts dynamically from live project query results.
- `JsonLd` (SEO structured data in `App.tsx`): moved inside `PortfolioProvider` to read dynamic profile data.
- `Resume.tsx` & `data/profile.ts`: removed static `/resume.pdf` hardcoding to ensure API-backed resume URL is used.

## Step 6 — FINAL QA & BUILD VALIDATION
- **Status:** DONE · 100% of step · **Overall: 100% (6/6)**
- `Frontend/admin`: `npm run build` green (`tsc -b && vite build`).
- `Frontend/User`: `npm run build` green (`tsc -b && vite build && prerender.mjs`).
- `Backend`: `npm run build` green (`tsc`).
- All changes staged and committed cleanly on `main` branch with no new branches created.
