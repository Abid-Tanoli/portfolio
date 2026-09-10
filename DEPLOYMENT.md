# Static Deployment Runbook

The portfolio is now a fully static Vite site. Nginx serves `Frontend/User/dist`; there is no backend, database, admin panel, PM2 process, API proxy, or Node process in production.

## Server prerequisites

Install only Git, Node.js/npm for the build, and Nginx:

```bash
sudo apt-get update
sudo apt-get install -y nginx git
```

Clone the repository on the VPS. The only frontend environment values required at build time are `VITE_SITE_URL` and the three `VITE_EMAILJS_*` values documented in `Frontend/User/.env.example`.

## Nginx configuration

Replace `your-domain.com` and the repository path as needed. This is the complete server block; it has no `/api/` proxy and no `/admin/` location:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/portfolio/Frontend/User/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Apply and test it with:

```bash
sudo nano /etc/nginx/sites-available/portfolio
sudo ln -sfn /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t
sudo systemctl reload nginx
```

Configure HTTPS separately with Certbot if needed.

## Build and deploy

Use the root `deploy.sh` from `/var/www/portfolio`:

```bash
bash /var/www/portfolio/deploy.sh
```

There is no production Node process to start or restart. After the new static site is confirmed working, it is safe to remove the old PM2 entry:

```bash
pm2 delete portfolio-backend
pm2 save
```

## Live verification checklist

1. Pull the latest repository on the VPS.
2. Run the static build and confirm `Frontend/User/dist` exists.
3. Run `sudo nginx -t`, then reload Nginx.
4. Visit the public site and test `/`, `/about`, `/projects`, `/resume`, and `/contact`.
5. After configuring EmailJS, submit one contact message and confirm delivery.
6. Remove `portfolio-backend` from PM2 only after the static site is working.
