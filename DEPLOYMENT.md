# Deployment Runbook

This portfolio uses the confirmed MERN-style architecture:

- `Frontend/`: React + Vite static app, deployed to Vercel.
- `Backend/`: Node.js + Express API, deployed to Railway or another persistent Node host.

The backend stays separate because the contact API, GitHub cache, MongoDB logging, and future long-lived integrations are cleaner as a persistent Express service than as frontend-only static hosting.

## Local Development

1. Install dependencies from the repo root:

   ```powershell
   npm install
   npm install --prefix Frontend
   npm install --prefix Backend
   ```

2. Copy env files:

   ```powershell
   Copy-Item Frontend\.env.example Frontend\.env
   Copy-Item Backend\.env.example Backend\.env
   ```

3. Start both apps:

   ```powershell
   npm run dev
   ```

Vite runs on `http://localhost:5173` and proxies `/api` to the Express backend on `http://localhost:4000`.

## Backend Deployment

Deploy `Backend/` as a Node service.

Required build/start commands:

```powershell
npm install
npm run build
npm start
```

Required environment variables:

- `PORT`: provided by the host, or `4000` locally.
- `CORS_ORIGINS`: comma-separated frontend origins, for example `https://your-portfolio.vercel.app`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`: contact form email transport.
- `SMTP_FROM`, `CONTACT_TO`: optional sender/recipient overrides.
- `MONGO_URI`: optional MongoDB connection string for storing contact messages.
- `GITHUB_TOKEN`: optional GitHub token for higher rate limits.

Health check:

```text
GET /api/health
```

## Frontend Deployment

Deploy `Frontend/` to Vercel as a Vite project.

Build command:

```powershell
npm run build
```

Output directory:

```text
dist
```

Required Vercel environment variables:

- `VITE_API_URL`: production backend URL, for example `https://your-api.up.railway.app`.
- `VITE_SITE_URL`: production frontend URL.
- `VITE_RESUME_URL`: optional override; defaults to `/resume.pdf`.

`Frontend/vercel.json` contains the SPA fallback rewrite for deep links.

## Current Blockers

- LinkedIn URL is still pending.
- Vercel login/token is needed to publish from this machine.
- Railway access is needed to confirm the final backend service URL.
- SMTP credentials are needed before the contact form can send real mail in production.
