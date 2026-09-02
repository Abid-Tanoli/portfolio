import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const DIST = path.resolve(import.meta.dirname, "../dist");

const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/bq-play",
  "/projects/lowpricemart",
  "/projects/event-organizer",
  "/projects/tourist-places-guide",
  "/certifications",
  "/resume",
  "/github",
  "/contact",
];

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/microsoft-edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

function findBrowser() {
  return EDGE_CANDIDATES.find((p) => existsSync(p)) ?? null;
}

// Fall back to plain client-side rendering (copy dist/index.html to each route)
// so Vercel's vercel.json rewrites still resolve and the build never crashes
// just because no headless browser could be found or launched.
async function copySpaFallback() {
  const spa = path.join(DIST, "index.html");
  if (!existsSync(spa)) throw new Error("dist/index.html missing — run `npm run build` first");
  let count = 0;
  for (const route of ROUTES) {
    const file = route === "/" ? "index.html" : `${route.replace(/^\//, "").replace(/\//g, "_")}.html`;
    const out = path.join(DIST, file);
    if (route !== "/") {
      await writeFile(out, await readFile(spa, "utf8"), "utf8");
      count += 1;
    }
  }
  console.warn(`[prerender] no usable browser found — falling back to client-side rendering (${count} route fallbacks written)`);
}

function waitForPort(timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      fetch(`${BASE}/`)
        .then(() => resolve(true))
        .catch(() => {
          if (Date.now() - start > timeoutMs) reject(new Error("preview server did not start"));
          else setTimeout(tick, 250);
        });
    };
    tick();
  });
}

function routeChunkName(route, chunkFiles) {
  let prefix;
  if (route === "/") prefix = "Home";
  else if (route.startsWith("/projects/")) prefix = "ProjectDetail";
  else if (route === "/projects") prefix = "Projects";
  else if (route === "/about") prefix = "About";
  else if (route === "/certifications") prefix = "Certifications";
  else if (route === "/resume") prefix = "Resume";
  else if (route === "/github") prefix = "Github";
  else if (route === "/contact") prefix = "Contact";
  else return null;
  return chunkFiles.find((f) => f.startsWith(`${prefix}-`) && f.endsWith(".js")) ?? null;
}

function optimizeHtml(html, route, chunkFiles) {
  const stripped = html.replace(/<link rel="modulepreload"[^>]*>/g, "");
  const chunk = routeChunkName(route, chunkFiles);
  const inject = [
    '<link rel="preload" as="image" href="/content/images/profile.jpg" fetchpriority="high" />',
  ];
  if (chunk) inject.unshift(`<link rel="modulepreload" href="/assets/${chunk}" />`);
  return stripped.replace("</title>", `</title>${inject.join("")}`);
}

let server = null;

try {
  if (!existsSync(path.join(DIST, "index.html"))) {
    throw new Error("dist/index.html missing — run `npm run build` first");
  }

  server = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort"],
    { cwd: path.resolve(import.meta.dirname, ".."), stdio: "ignore" }
  );

  await waitForPort();

  let executablePath = findBrowser();
  let browser = null;
  try {
    if (executablePath) {
      browser = await puppeteer.launch({
        executablePath,
        headless: "new",
        args: [...chromium.args, "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      });
    } else {
      // No system browser (e.g. Vercel's build container): use @sparticuz/chromium.
      executablePath = await chromium.executablePath();
      browser = await puppeteer.launch({
        executablePath,
        headless: "new",
        args: [...chromium.args, "--no-sandbox", "--disable-dev-shm-usage"],
      });
    }
  } catch (err) {
    console.warn(`[prerender] could not launch a browser (${err?.message ?? err})`);
  }

  if (!browser) {
    await copySpaFallback();
  } else {
    const chunkFiles = await readdir(path.join(DIST, "assets"));

    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.evaluateOnNewDocument(() => {
        window.__PRERENDER__ = true;
      });
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0", timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1200));
      const html = optimizeHtml(
        await page.evaluate(() => `<!doctype html>${document.documentElement.outerHTML}`),
        route,
        chunkFiles
      );
      const file = route === "/" ? "index.html" : `${route.replace(/^\//, "").replace(/\//g, "_")}.html`;
      await mkdir(DIST, { recursive: true });
      await writeFile(path.join(DIST, file), html, "utf8");
      console.log(`prerendered ${route} -> ${file} (${html.length} bytes)`);
      await page.close();
    }

    await browser.close();
    console.log("prerender complete");
  }
} finally {
  if (server) server.kill();
}
