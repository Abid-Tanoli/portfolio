import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const contentDir = path.join(repoRoot, "content");
const htmlPath = path.join(contentDir, "resume.html");
const pdfPath = path.join(contentDir, "resume.pdf");

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const executablePath = EDGE_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Edge binary found — cannot render resume PDF.");
  process.exit(1);
}
if (!existsSync(htmlPath)) {
  console.error(`Missing source: ${htmlPath}`);
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle0" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
});
await browser.close();
console.log(`Resume PDF written: ${pdfPath}`);
