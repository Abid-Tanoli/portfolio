#!/bin/bash
set -e

echo "=== Pulling latest code ==="
cd /var/www/portfolio
git pull

echo "=== Building Frontend/User ==="
cd /var/www/portfolio/Frontend/User
npm install
npm run build

echo "=== Reloading Nginx ==="
sudo systemctl reload nginx

echo "=== Deploy complete (static site) ==="
