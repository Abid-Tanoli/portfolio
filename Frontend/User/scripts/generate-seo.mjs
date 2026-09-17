import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Generates public/sitemap.xml and public/robots.txt at build time from VITE_SITE_URL.
// These files were formerly hardcoded against a stale Vercel placeholder domain.
//
// The URL resolution order is:
//   1. VITE_SITE_URL from Frontend/User/.env (if present)
//   2. process.env.VITE_SITE_URL
//   3. The current production VPS URL  (placeholder to be replaced once a real
//      domain is set up — update DEPLOYMENT.md and .env.example at the same time).

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(frontendRoot, ".env");
const publicDir = join(frontendRoot, "public");

function loadEnvFile(file) {
  try {
    const raw = readFileSync(file, "utf8");
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      out[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

const env = loadEnvFile(envPath);
const SITE_URL = (env.VITE_SITE_URL ?? process.env.VITE_SITE_URL ?? "http://187.127.96.220:8080").replace(/\/+$/, "");

// Every real, reachable route. Project slugs mirror src/data/projects.ts.
const ROUTES = [
  ["/", 1.0],
  ["/projects", 0.9],
  ["/about", 0.8],
  ["/projects/bq-play", 0.7],
  ["/projects/lowpricemart", 0.7],
  ["/projects/event-organizer", 0.7],
  ["/projects/tourist-places-guide", 0.7],
  ["/projects/ecommerce", 0.7],
  ["/projects/web-3-backend", 0.7],
  ["/projects/web-2-assignments", 0.7],
  ["/projects/web-dev-1-projects", 0.7],
  ["/contact", 0.7],
  ["/certifications", 0.6],
  ["/resume", 0.6],
  ["/github", 0.6],
];

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ROUTES.map(([pathname, priority]) => `  <url><loc>${SITE_URL}${pathname}</loc><priority>${priority}</priority></url>`).join("\n") +
  "\n</urlset>\n";

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");
console.log(`[generate-seo] wrote sitemap.xml + robots.txt with SITE_URL=${SITE_URL}`);