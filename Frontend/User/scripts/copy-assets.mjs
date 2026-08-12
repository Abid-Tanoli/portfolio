import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(frontendRoot, "..");
const contentDir = join(repoRoot, "content");
const publicDir = join(frontendRoot, "public");

const contentResume = join(contentDir, "resume.pdf");
const publicResume = join(publicDir, "resume.pdf");
if (existsSync(contentResume)) {
  copyFileSync(contentResume, publicResume);
  console.log(`[copy-assets] copied ${contentResume} -> ${publicResume}`);
}

const contentPortfolio = join(contentDir, "portfolio.pdf");
const publicPortfolio = join(publicDir, "Portfolio.pdf");
if (existsSync(contentPortfolio)) {
  copyFileSync(contentPortfolio, publicPortfolio);
  console.log(`[copy-assets] copied ${contentPortfolio} -> ${publicPortfolio}`);
}

const contentImages = join(contentDir, "images");
if (existsSync(contentImages)) {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    });
  const files = walk(contentImages);
  for (const from of files) {
    const rel = relative(contentImages, from);
    const to = join(publicDir, "content", "images", rel);
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    console.log(`[copy-assets] copied ${from} -> ${to}`);
  }
}

mkdirSync(join(publicDir, "content", "images"), { recursive: true });
