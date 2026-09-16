import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:5173";
const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/bq-play",
  "/projects/lowpricemart",
  "/projects/event-organizer",
  "/projects/tourist-places-guide",
  "/projects/ecommerce",
  "/certifications",
  "/resume",
  "/github",
  "/contact",
  "/does-not-exist",
];

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const executablePath = EDGE_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) throw new Error("no Edge binary");

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

let failures = 0;
for (const route of ROUTES) {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(`[console.${m.type()}] ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
  page.on("requestfailed", (r) => errors.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText ?? ""}`));
  try {
    const waitUntil = route === "/resume" ? "domcontentloaded" : "networkidle2";
    await page.goto(`${BASE}${route}`, { waitUntil, timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    const title = await page.title();
    const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() ?? "(none)");
    const hasError = errors.filter((e) => !e.includes("favicon") && !e.includes("vite:") && !e.includes("Warning: React"));
    if (hasError.length > 0) {
      failures++;
      console.log(`\n=== FAIL ${route} ===`);
      for (const e of hasError.slice(0, 8)) console.log("  " + e);
    } else {
      console.log(`ok   ${route}  ->  h1: "${h1.slice(0, 60)}"  (title: "${title.slice(0, 50)}")`);
    }
  } catch (e) {
    failures++;
    console.log(`\n=== FAIL ${route} (load) ===\n  ${e.message}`);
  }
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "\nSMOKE TEST PASSED" : `\nSMOKE TEST FAILED: ${failures} route(s)`);
process.exit(failures === 0 ? 0 : 1);



