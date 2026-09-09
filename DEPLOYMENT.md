# Deployment Runbook

This project is deployed on one VPS. Nginx serves both Vite builds and reverse-proxies `/api/` to the Node.js backend. PM2 keeps the backend process running after deploys and reboots.

## Server prerequisites

Install Node.js (the version supported by the lockfiles), npm, PM2, and Nginx. The backend uses Puppeteer for PDF generation, so install Chromium's runtime libraries on Ubuntu/Debian as well:

```bash
sudo apt-get update
sudo apt-get install -y nginx libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
  libgbm1 libasound2 libpangocairo-1.0-0 libpango-1.0-0 libcairo2 \
  libatspi2.0-0 libgtk-3-0 fonts-liberation
npm install --global pm2
```

Clone the repository on the VPS, install dependencies in `Backend`, `Frontend/User`, and `Frontend/admin`, and create `Backend/.env` from `Backend/.env.example`.

## Required backend environment

Set these variables in `Backend/.env`:

| Variable | Purpose |
| --- | --- |
| `PORT` | Internal backend port, normally `4000`; Nginx proxies to this port. |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_SECRET` | Strong secret used to sign admin sessions. |
| `ADMIN_INITIAL_EMAIL` | Initial admin email. |
| `ADMIN_INITIAL_PASSWORD` | Initial admin password, changed after first login. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `CORS_ORIGINS` | Comma-separated exact frontend origins served by Nginx, including the real VPS origin. |
| `GITHUB_TOKEN` | Optional GitHub API token. |
| `SMTP_HOST` | Optional SMTP host for contact forwarding. |
| `SMTP_PORT` | Optional SMTP port, usually `587`. |
| `SMTP_SECURE` | Optional `true` for port 465, otherwise `false`. |
| `SMTP_USER` | Optional SMTP username. |
| `SMTP_PASS` | Optional SMTP password. |
| `SMTP_FROM` | Optional sender address. |
| `CONTACT_TO` | Destination address for contact messages. |

`NODE_ENV=production` should also be set on the VPS. `CLOUDINARY_URL` may be set when preferred by the Cloudinary tooling, but the three explicit Cloudinary variables above are the application contract.

## Nginx layout

Build both frontend applications. Use one server block for the public domain (replace paths and domain names with the VPS values):

```nginx
server {
	listen 80;
	server_name your-domain.com;

	root /srv/portfolio/Frontend/User/dist;
	index index.html;

	location /api/ {
		proxy_pass http://127.0.0.1:4000;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location /admin/ {
		alias /srv/portfolio/Frontend/admin/dist/;
		try_files $uri $uri/ /admin/index.html;
	}

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

The `/` fallback serves User SPA routes, `/admin/` fallback serves Admin SPA routes, and `/api/` is never handled by a frontend. Test the config with `sudo nginx -t`, then reload with `sudo systemctl reload nginx`. Configure HTTPS separately with Certbot if the domain is available.

## Build, start, and deploy

The `deploy.sh` pattern is intentionally simple: pull the selected revision, install dependencies, build both frontends and the backend, then reload the PM2 process and Nginx. Run it from the repository root, or keep the equivalent commands in the server's deployment script:

```bash
#!/usr/bin/env bash
set -euo pipefail

git pull --ff-only
npm ci --prefix Backend
npm ci --prefix Frontend/User
npm ci --prefix Frontend/admin
npm run build --prefix Backend
npm run build --prefix Frontend/User
npm run build --prefix Frontend/admin
pm2 restart portfolio-backend --update-env || pm2 start Backend/dist/index.js --name portfolio-backend
pm2 save
sudo nginx -t
sudo systemctl reload nginx
```

The backend build outputs `Backend/dist/index.js`; the two frontend builds output their respective `dist` directories. Check logs with `pm2 logs portfolio-backend` and verify `GET https://your-domain.com/api/health` after each deployment.

## Live verification checklist

1. Open the public site and an Admin route such as `/admin/login`.
2. Log in and edit a project or profile field; confirm it appears on the public site.
3. Regenerate the resume in Admin and verify the `/resume` route.
4. Submit the contact form and verify the message appears in Admin.
5. Confirm `GET /api/health` reports the expected database status.
