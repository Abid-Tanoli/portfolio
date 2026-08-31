# Deployment Runbook

This portfolio uses the modern MERN architecture split into 3 independent services:

1. **Frontend User App (`Frontend/User`)** — Public visitor portfolio (React + Vite + SSR/Prerender), deployed to Vercel.
2. **Frontend Admin App (`Frontend/admin`)** — Dedicated CMS console (React + Vite + Tailwind + Lucide), deployed to Vercel.
3. **Backend API (`Backend`)** — Persistent Node.js + Express + MongoDB service with Puppeteer PDF generation and Cloudinary CDN uploads, deployed to Railway.

---

## 1. Backend Service (Railway / Render / VPS)

### Build & Run Settings
- **Root Directory**: `Backend`
- **Build Command**: `npm run build` (runs `tsc`)
- **Start Command**: `npm start` (runs `node dist/index.js`)

### Required Production Environment Variables
| Variable | Description |
| :--- | :--- |
| `PORT` | Provided automatically by Railway (defaults to 4000 locally) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing admin JWT sessions |
| `ADMIN_INITIAL_EMAIL` | Initial admin account email (e.g. `visionaryabidi@gmail.com`) |
| `ADMIN_INITIAL_PASSWORD` | Initial admin account password (synced on startup) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image/PDF uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins (e.g. `https://abidtanoli.vercel.app,https://admin-abidtanoli.vercel.app`) |
| `SMTP_HOST` | (Optional) SMTP host for contact email forwarding |
| `SMTP_PORT` | (Optional) SMTP port (default 587) |
| `SMTP_SECURE` | (Optional) `true` for port 465, `false` otherwise |
| `SMTP_USER` | (Optional) SMTP username |
| `SMTP_PASS` | (Optional) SMTP password |
| `SMTP_FROM` | (Optional) From address for outgoing contact emails |
| `CONTACT_TO` | Email address receiving contact messages |

### Health Check Endpoint
```text
GET /api/health
```
Returns `{ status: "ok", db: "connected", uptime: ... }`.

---

## 2. Frontend User App (Vercel Project 1)

### Build & Run Settings
- **Root Directory**: `Frontend/User`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables
| Variable | Value |
| :--- | :--- |
| `VITE_API_URL` | Live backend API URL (e.g. `https://portfolio-backend-production-xxxx.up.railway.app`) |
| `VITE_SITE_URL` | Live public site URL (e.g. `https://abidtanoli.vercel.app`) |

---

## 3. Frontend Admin App (Vercel Project 2)

### Build & Run Settings
- **Root Directory**: `Frontend/admin`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables
| Variable | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | Live backend API base URL (e.g. `https://portfolio-backend-production-xxxx.up.railway.app/api`) |
| `VITE_USER_SITE_URL` | Live public site URL (e.g. `https://abidtanoli.vercel.app`) — used for "View Public Site" links |

---

## 4. Live Verification Checklist
1. Log into the Admin panel at `/login`.
2. Edit a project or profile field; confirm the updated content reflects on the public User site.
3. Open **Resume Manager** in Admin, click **"Regenerate PDF"** to compile a fresh PDF from MongoDB and publish it to the `/resume` route.
4. Test the Contact Form on `/contact` and verify the incoming message appears in Admin under **Contact Form**.
