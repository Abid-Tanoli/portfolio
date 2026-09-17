# Portfolio — Abid Ali Tanoli

A static, single-page-application portfolio for **Abid Ali Tanoli**, Full Stack MERN developer.
It is 100% frontend: no backend, no database, no CMS, no admin panel. All content is
typed static data living in the repo and rendered at build time.

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite** — fast production build with per-route code splitting
- **Tailwind CSS v4** — CSS-first design tokens with full light/dark theming and persistence
- **React Router v7** — SPA routes (`/`, `/about`, `/projects`, `/resume`, `/contact`, `/github`, …)
- **EmailJS** — browser-side contact form (no backend required)
- **Puppeteer-core** (build tooling only) — prerendering static HTML per route + headless smoke tests

All editorial content lives in typed modules under `Frontend/User/src/data/`
(`profile.ts`, `experience.ts`, `education.ts`, `skills.ts`, `projects.ts`,
`certifications.ts`, `achievements.ts`). `robots.txt` and `sitemap.xml` are generated
at build time from `VITE_SITE_URL`.

## Repository layout

```
portfolio/
├── README.md                 # this file
├── DEPLOYMENT.md             # Nginx static-hosting runbook
├── deploy.sh                 # one-command deploy on the VPS
└── Frontend/User/            # the entire site
    ├── src/                  # React app + typed data modules
    ├── public/               # favicon, og-image, robots/sitemap (generated), profile.jpg
    └── scripts/              # prebuild SEO generation, prerender, smoke tests
```

## Getting started (local dev)

Requires Node.js 20+ and npm.

```bash
cd Frontend/User
npm install
cp .env.example .env         # set VITE_SITE_URL + VITE_EMAILJS_* values (see README there)
npm run dev                  # http://localhost:5173
```

Or from the repo root via the convenience wrapper:

```bash
npm run dev:user
npm run build
```

## Building and previewing

```bash
cd Frontend/User
npm run build    # typecheck (tsc -b) → vite build → prerender static HTML per route
npm run preview # serve the production build locally
```

The output is a fully static build in `dist/`. It can be served by any static file
server; Nginx with `try_files $uri $uri/ /index.html` is recommended (see
`DEPLOYMENT.md`).

## Deploying

On the VPS, a single `deploy.sh` script pulls the latest code, installs dependencies,
builds `Frontend/User`, and reloads Nginx. See `DEPLOYMENT.md` for the full runbook
and the required environment variables.

---

## History

This portfolio was originally engineered as a **MERN monorepo** (React frontend,
Express backend, MongoDB, and a CMS-style admin panel with Cloudinary uploads),
planned for Vercel/Railway hosting. Over several passes it was progressively
simplified:

1. The portfolio was rewritten as a **fully static Vite site**; editorial content was
   exported from the CMS into typed static data modules, and the live GitHub/API
   enrichment was replaced with curated static snapshots.
2. The contact form moved to **EmailJS** (browser-side), removing the last backend
   process.
3. The **admin panel and backend were removed entirely**. Deployment moved from
   Vercel/Railway to a **single Nginx static host** on the VPS.
4. Final polish: documentation consolidated into this README, CMS-era placeholder
   language and the old `content/` upload workflow removed, and SEO/theme/resume
   cleanups applied (see git history on `main`).

The repo is now intentionally minimal: a static frontend, build tooling, and deploy
scripts only.