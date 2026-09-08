import puppeteer from "puppeteer";
import { Profile } from "../models/Profile.js";
import { Experience } from "../models/Experience.js";
import { Education } from "../models/Education.js";
import { Skill } from "../models/Skill.js";
import { Certification } from "../models/Certification.js";
import { Project } from "../models/Project.js";
import { uploadToCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

const FALLBACK_PROFILE = {
  name: "Abid Ali Tanoli",
  title:
    "Full Stack Web Developer (MERN) | AI-Augmented Development | Accountant & Receivable Management",
  phoneDisplay: "+92 332 3178928",
  email: "visionaryabidi@gmail.com",
  github: "https://github.com/Abid-Tanoli",
  githubUsername: "Abid-Tanoli",
  location: "Karachi, Pakistan",
};

const FALLBACK_SUMMARY =
  "Full Stack Web Developer with hands-on MERN expertise (MongoDB, Express.js, React.js, Node.js) " +
  "and a growing specialization in AI-augmented development — integrating tools such as Antigravity, " +
  "OpenAI Codex, Qwen, and OpenCode into real production workflows. Currently an intern at Bano Qabil " +
  "Incubation Center, building BQ-PLAY, a live cricket scoring platform with real-time updates. A " +
  "complementary 10+ year background in Accounting & Finance — including receivable management " +
  "supervision — brings analytical rigor, structured problem-solving, and financial reporting " +
  "discipline to every engineering decision.";

const SKILL_CATEGORY_TITLES: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend & Database",
  ai: "AI-Augmented Development",
  deployment: "Deployment & DevOps",
  tools: "Tools & Workflow",
};

const SKILL_CATEGORY_ORDER = ["frontend", "backend", "ai", "deployment", "tools"];

const RESUME_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: Calibri, Arial, Helvetica, sans-serif;
    color: #1a1a1a;
    font-size: 10.5pt;
    line-height: 1.42;
    max-width: 800px;
    margin: 0 auto;
    padding: 36px 44px;
  }
  h1 { font-size: 21pt; letter-spacing: -0.3px; }
  .title { font-size: 11pt; color: #333; margin-top: 2px; }
  .contact { font-size: 9.5pt; color: #444; margin-top: 6px; }
  .contact a { color: #1a1a1a; text-decoration: none; }
  h2 {
    font-size: 11pt;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1.4px solid #1a1a1a;
    padding-bottom: 2px;
    margin: 16px 0 8px;
  }
  p.summary { margin-bottom: 2px; }
  .role { font-weight: bold; }
  .org { font-weight: bold; }
  .period { font-style: italic; color: #444; white-space: nowrap; }
  .entry { margin-bottom: 8px; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; }
  ul { padding-left: 18px; margin-top: 2px; }
  li { margin-bottom: 1px; }
  .skills { margin-top: 2px; }
  .skills b { display: inline-block; }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function periodStart(period: string): number {
  const match = period.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i);
  if (!match) return 0;
  const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(
    match[0].slice(0, 3).toLowerCase()
  );
  return Number(match[1]) * 12 + month;
}

export async function buildResumeDocument(): Promise<string> {
  const [profileDoc, experiences, education, skills, certifications, projects] = await Promise.all([
    Profile.findOne(),
    Experience.find().sort({ order: 1, _id: 1 }),
    Education.find().sort({ order: 1, _id: 1 }),
    Skill.find().sort({ category: 1, order: 1, _id: 1 }),
    Certification.find().sort({ order: 1, _id: 1 }),
    Project.find().sort({ isFeatured: -1, order: 1, _id: 1 }),
  ]);

  const profile = profileDoc ?? (FALLBACK_PROFILE as typeof FALLBACK_PROFILE & { resumeSummary?: string });
  const name = profile.name || FALLBACK_PROFILE.name;
  const title =
    profile.title && profile.title !== "Full Stack Web Developer (MERN)"
      ? `${profile.title} | AI-Augmented Development | Accountant & Receivable Management`
      : FALLBACK_PROFILE.title;
  const phone = profile.phoneDisplay || FALLBACK_PROFILE.phoneDisplay;
  const email = profile.email || FALLBACK_PROFILE.email;
  const github = profile.githubUsername
    ? `github.com/${profile.githubUsername}`
    : (profile.github || FALLBACK_PROFILE.github).replace(/^https?:\/\//, "");
  const location = profile.location || FALLBACK_PROFILE.location;
  const summary =
    (typeof profile.resumeSummary === "string" && profile.resumeSummary.trim()) || FALLBACK_SUMMARY;

  const educationDegrees = education.map((e) => e.degree);
  const resumeCerts = certifications.filter(
    (c) => !educationDegrees.some((degree) => c.title.startsWith(degree))
  );

  const skillsByCategory = new Map<string, string[]>();
  for (const category of SKILL_CATEGORY_ORDER) skillsByCategory.set(category, []);
  for (const skill of skills) {
    const list = skillsByCategory.get(skill.category);
    if (list) list.push(skill.name);
  }

  const parts: string[] = [];

  parts.push(`
  <h1>${escapeHtml(name)}</h1>
  <div class="title">${escapeHtml(title)}</div>
  <div class="contact">${escapeHtml(location)} · ${escapeHtml(phone)} · ${escapeHtml(email)} · ${escapeHtml(github)}</div>`);

  parts.push(`
  <h2>Professional Summary</h2>
  <p class="summary">${escapeHtml(summary)}</p>`);

  const skillLines = [...skillsByCategory.entries()]
    .filter(([, names]) => names.length > 0)
    .map(
      ([category, names]) =>
        `<b>${escapeHtml(SKILL_CATEGORY_TITLES[category] ?? category)}:</b> ${escapeHtml(names.join(", "))}`
    );
  if (skillLines.length > 0) {
    parts.push(`
  <h2>Skills</h2>
  <div class="skills">
    ${skillLines.join("<br />\n    ")}
  </div>`);
  }

  const orderedExperiences = [...experiences].sort(
    (a, b) => periodStart(b.period) - periodStart(a.period) || a.order - b.order
  );

  if (orderedExperiences.length > 0) {
    parts.push(`
  <h2>Experience</h2>`);
    for (const exp of orderedExperiences) {
      const highlights = (exp.highlights ?? []).slice(0, 2);
      parts.push(`
  <div class="entry">
    <div class="entry-head">
      <span><span class="role">${escapeHtml(exp.role)}</span> — <span class="org">${escapeHtml(exp.organization)}</span></span>
      <span class="period">${escapeHtml(exp.period)}</span>
    </div>
    ${highlights.length > 0 ? `<ul>\n      ${highlights.map((h: string) => `<li>${escapeHtml(h)}</li>`).join("\n      ")}\n    </ul>` : ""}
  </div>`);
    }
  }

  if (projects.length > 0) {
    const detailedProjects = projects.slice(0, 4);
    const additionalProjects = projects.slice(4);
    parts.push(`
  <h2>Projects</h2>`);
    for (const project of detailedProjects) {
      const repo = project.repoUrl ? project.repoUrl.replace(/^https?:\/\//, "") : "";
      const stack = (project.stack ?? []).slice(0, 6).join(", ");
      parts.push(`
  <div class="entry">
    <div class="entry-head">
      <span><span class="role">${escapeHtml(project.name)}</span> — ${escapeHtml(project.tagline || project.description)}</span>
      ${repo ? `<span class="period">${escapeHtml(repo)}</span>` : ""}
    </div>
    ${stack ? `<div class="skills"><b>Stack:</b> ${escapeHtml(stack)}</div>` : ""}
  </div>`);
    }
    if (additionalProjects.length > 0) {
      parts.push(`
  <div class="entry"><b>Additional Projects:</b> ${escapeHtml(additionalProjects.map((project) => project.name).join("; "))}</div>`);
    }
  }

  if (education.length > 0) {
    parts.push(`
  <h2>Education</h2>`);
    for (const edu of education) {
      parts.push(`
  <div class="entry">
    <div class="entry-head">
      <span><span class="org">${escapeHtml(edu.degree)}</span> — ${escapeHtml(edu.institution)}</span>
      <span class="period">${escapeHtml(edu.period)}</span>
    </div>
  </div>`);
    }
  }

  if (resumeCerts.length > 0) {
    parts.push(`
  <h2>Certifications</h2>
  <ul>
    ${resumeCerts
      .map(
        (c) =>
          `<li>${escapeHtml(c.title)}${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ""}${c.batch ? ` (${escapeHtml(c.batch)})` : ""}</li>`
      )
      .join("\n    ")}
  </ul>`);
  }

  const body = parts.join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(name)} — Resume</title>
<style>${RESUME_CSS}</style>
</head>
<body>${body}
</body>
</html>`;
}

export async function renderPdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

export interface RegenerateResult {
  resumeUrl: string;
  updatedAt: string;
  warning?: string;
}

export async function regenerateResume(): Promise<RegenerateResult> {
  const html = await buildResumeDocument();
  const pdfBuffer = await renderPdf(html);
  const pdfDataUri = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;

  let resumeUrl: string = pdfDataUri;
  let warning: string | undefined;

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(pdfBuffer, {
        folder: "resume",
        resourceType: "image",
        filename: "Abid-Ali-Tanoli-Resume",
      });
      // A successful upload is the source of truth. Cloudinary delivery may not support
      // HEAD consistently, but the returned secure URL is still the canonical asset URL.
      resumeUrl = result.url;
    } catch (uploadErr) {
      console.error("[resumeService] Cloudinary upload FAILED — falling back to base64 Data URI");
      console.error("[resumeService] Error name:", uploadErr instanceof Error ? uploadErr.name : "Unknown");
      console.error("[resumeService] Error message:", uploadErr instanceof Error ? uploadErr.message : String(uploadErr));
      if (uploadErr && typeof uploadErr === "object" && "status" in uploadErr) {
        console.error("[resumeService] HTTP status:", (uploadErr as { status: number }).status);
      }
      if (uploadErr && typeof uploadErr === "object" && "http_code" in uploadErr) {
        console.error("[resumeService] Cloudinary http_code:", (uploadErr as { http_code: number }).http_code);
      }
      if (uploadErr instanceof Error && uploadErr.stack) {
        console.error("[resumeService] Stack:", uploadErr.stack);
      }
      warning = `Cloudinary upload error (${uploadErr instanceof Error ? uploadErr.message : "unknown"}) — served as base64 Data URI. Configure valid Cloudinary credentials to host on CDN.`;
    }
  } else {
    warning =
      "Cloudinary credentials missing. PDF served as base64 Data URI in local dev — configure Cloudinary to publish a real hosted URL.";
  }

  let profile = await Profile.findOne();
  if (!profile) {
    profile = new Profile({
      name: FALLBACK_PROFILE.name,
      firstName: "Abid",
      title: "Full Stack Web Developer (MERN)",
      tagline: "MERN · AI-Augmented Development · REST APIs · Financial Analysis",
      email: FALLBACK_PROFILE.email,
      phone: "+92 332-3178928",
      phoneDisplay: FALLBACK_PROFILE.phoneDisplay,
      location: FALLBACK_PROFILE.location,
      github: FALLBACK_PROFILE.github,
      githubUsername: FALLBACK_PROFILE.githubUsername,
      heroSummary: FALLBACK_SUMMARY,
      careerGoals:
        "To grow as a full stack engineer building reliable, AI-augmented web products, " +
        "deepening expertise in cloud deployment and scalable system design.",
    });
  }
  profile.resumeUrl = resumeUrl;
  profile.resumeUpdatedAt = new Date();
  await profile.save();

  return { resumeUrl, updatedAt: profile.resumeUpdatedAt.toISOString(), warning };
}