# Static Deployment Runbook

The portfolio is a fully static Vite site. Nginx serves `Frontend/User/dist`; there is
no backend process, database, or admin panel in production.

## Prerequisites on the VPS

Install Git, Node.js/npm (build only), and Nginx:

```bash
sudo apt-get update
sudo apt-get install -y nginx git
```

## Environment variables

The build needs these values (documented in `Frontend/User/.env.example`). They are
read at **build time**; the production bundle and `robots.txt`/`sitemap.xml` are baked
with them, so there is no server-side config.

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SITE_URL` | Public site URL — used for canonical/OG meta and generated `sitemap.xml`/`robots.txt` | Yes |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID (contact form) | For the contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | For the contact form |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | For the contact form |

If `VITE_SITE_URL` is not set at build time, the build falls back to the current host
(`http://187.127.96.220:8080`). Point `VITE_SITE_URL` at the real domain once one is
configured, then rebuild.

## Nginx configuration

This server block is complete — no `/api/` proxy, no `/admin/` location:

```nginx
server {
    listen 8080;
    server_name 187.127.96.220;

    root /var/www/portfolio/Frontend/User/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Install it and check the config:

```bash
sudo nano /etc/nginx/sites-available/portfolio
sudo ln -sfn /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t
sudo systemctl reload nginx
```

HTTPS can be added separately with Certbot once a real domain is in place.

## Build and deploy

From `/var/www/portfolio`:

```bash
bash /var/www/portfolio/deploy.sh
```

`deploy.sh` pulls the latest code, installs dependencies, runs `npm run build` inside
`Frontend/User` (which includes prerendering and SEO file generation), and reloads
Nginx. There is no server process to start or restart.

## Verify after deploy

1. `git pull` completed and `Frontend/User/dist` exists after the build.
2. `sudo nginx -t` passes and Nginx has been reloaded.
3. Visit `/`, `/about`, `/projects`, `/resume`, `/contact`, and `/github` from a browser.
4. Submit one contact message and confirm delivery (EmailJS configured).
5. Confirm `sitemap.xml` and `robots.txt` reference the live `VITE_SITE_URL`.