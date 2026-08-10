import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const contentDir = path.join(repoRoot, "content");
const htmlPath = path.join(contentDir, "portfolio.html");
const pdfRoot = path.join(repoRoot, "Portfolio.pdf");
const pdfContent = path.join(contentDir, "portfolio.pdf");

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const executablePath = EDGE_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Edge binary found — cannot render portfolio PDF.");
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

const pdfOptions = {
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `
    <div style="width:100%;font-size:8px;color:#9ca3af;padding:0 15mm;font-family:Segoe UI,Calibri,sans-serif;display:flex;justify-content:space-between;">
      <span>Abid Ali Tanoli — Professional Portfolio</span>
      <span>August 2026</span>
    </div>`,
  footerTemplate: `
    <div style="width:100%;font-size:8px;color:#9ca3af;text-align:center;font-family:Segoe UI,Calibri,sans-serif;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>`,
  margin: { top: "18mm", bottom: "18mm", left: "0mm", right: "0mm" },
};

await page.pdf({ ...pdfOptions, path: pdfRoot });
await page.pdf({ ...pdfOptions, path: pdfContent });
await browser.close();

console.log(`Portfolio PDF written: ${pdfRoot}`);
console.log(`Portfolio PDF copy:   ${pdfContent}`);
