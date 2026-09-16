# Portfolio — Frontend (Static)

A fully static personal portfolio site built with React, TypeScript, and Vite. No backend, no database, no admin panel — all data lives in `src/data/` as typed TypeScript modules exported from the original CMS.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7** (SPA routing)
- **EmailJS** — contact form (browser-side, no backend required)
- **Zod** + **react-hook-form** — form validation
- **Puppeteer** — prerendering and smoke tests (build tooling only)

## Data layer

All portfolio data is static in `src/data/`:

| File | Records | Source |
|------|---------|--------|
| `profile.ts` | 1 | Single profile object |
| `experience.ts` | 4 | Work history |
| `education.ts` | 2 | Degrees |
| `skills.ts` | 30 skills / 5 groups | Categorized skill taxonomy |
| `certifications.ts` | 5 | Courses and certificates |
| `achievements.ts` | 5 | Milestone highlights |
| `projects.ts` | 8 | Portfolio projects (3 featured) |

## Getting started

```bash
npm install          # install dependencies
npm run predev       # copy assets from content/ to public/
npm run dev          # start dev server on http://localhost:5173
```

## Build and deploy

```bash
npm run build        # tsc -b && vite build (+ prerender)
```

Output goes to `dist/`. Serve with any static file server; Nginx with `try_files $uri $uri/ /index.html` is recommended.

### Environment variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SITE_URL` | Public site URL (OG meta + sitemap) | Yes |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | For contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | For contact form |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | For contact form |

Copy `.env.example` to `.env` and fill in the values.

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run smoke` | Headless smoke test against built site |
| `npm run portfolio` | Regenerate `content/portfolio.pdf` |
