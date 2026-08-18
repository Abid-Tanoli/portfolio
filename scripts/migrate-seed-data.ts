import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Import Models from Backend
import { Admin } from "../Backend/src/models/Admin.js";
import { Profile } from "../Backend/src/models/Profile.js";
import { Project } from "../Backend/src/models/Project.js";
import { Experience } from "../Backend/src/models/Experience.js";
import { Education } from "../Backend/src/models/Education.js";
import { Skill } from "../Backend/src/models/Skill.js";
import { Certification } from "../Backend/src/models/Certification.js";
import { Achievement } from "../Backend/src/models/Achievement.js";

// Static Data Sources
const profileSeed = {
  name: "Abid Ali Tanoli",
  firstName: "Abid",
  title: "Full Stack Web Developer (MERN)",
  tagline: "MERN · AI-Augmented Development · REST APIs · Financial Analysis",
  email: "visionaryabidi@gmail.com",
  phone: "+92 332-3178928",
  phoneDisplay: "+92 332 3178928",
  location: "Karachi, Pakistan",
  github: "https://github.com/Abid-Tanoli",
  githubUsername: "Abid-Tanoli",
  linkedin: "",
  linkedinPending: true,
  resumeUrl: "/resume.pdf",
  resumeSummary:
    "Full Stack Web Developer with hands-on MERN expertise (MongoDB, Express.js, React.js, Node.js) and a growing specialization in AI-augmented development — integrating tools such as Antigravity, OpenAI Codex, Qwen, and OpenCode into real production workflows. Currently an intern at Bano Qabil Incubation Center, building BQ-PLAY, a live cricket scoring platform with real-time updates. A complementary 10+ year background in Accounting & Finance — including receivable management supervision — brings analytical rigor, structured problem-solving, and financial reporting discipline to every engineering decision.",
  profilePictureUrl: "",
  heroSublines: [
    "MERN Stack Developer",
    "AI-Augmented Development",
    "REST API Design",
    "Financial Analysis",
  ],
  heroSummary:
    "Full Stack Web Developer building real products with the MERN stack — and a growing specialization in AI-augmented development, using tools like Antigravity, Codex, Qwen, and OpenCode to ship faster and smarter. Currently building BQ-PLAY, a live cricket scoring platform, at Bano Qabil Incubation Center.",
  aboutSummary: [
    "I'm a Full Stack Web Developer with hands-on MERN expertise — MongoDB, Express.js, React.js, and Node.js — and a fast-growing specialization in AI-augmented development. I integrate modern AI coding tools (Antigravity, OpenAI Codex, Qwen, OpenCode) directly into my workflow to design, build, and debug features faster without compromising quality.",
    "I'm currently an intern at Bano Qabil Incubation Center, where I'm building BQ-PLAY — a live cricket scoring platform with real-time updates, an admin scoring console, and player statistics. I work in an agile team with Git/GitHub, design REST APIs and MongoDB schemas, and ship responsive React frontends end-to-end.",
    "What sets me apart: 8+ years of professional experience in Accounting & Finance. I've built financial MIS dashboards, managed receivables across South Pakistan, and filed tax reports — so I bring analytical rigor, structured problem-solving, and a business mindset to every engineering decision.",
  ],
  careerGoals:
    "I'm on a trajectory from full stack development to AI-augmented engineering: building tools that combine the MERN stack with AI agents, prompt-driven workflows, and real-time systems — while keeping the financial discipline and analytical rigor I've carried from a decade in accounting.",
};

const experienceSeed = [
  {
    role: "Full Stack Web Development Intern",
    organization: "Bano Qabil Incubation Center",
    period: "Apr 2025 – Present",
    kind: "tech",
    summary: "Building production MERN applications in an agile team — from schema design to deployment.",
    highlights: [
      "Built and deployed BQ-PLAY, a live cricket scoring platform with real-time updates (MERN + Socket.IO)",
      "Designing REST APIs and MongoDB schemas for a 20+ route, 22-model backend",
      "Integrating AI coding tools (Antigravity, Codex, Qwen, OpenCode) into daily workflows",
      "Shipping responsive React frontends and collaborating via Git/GitHub in agile sprints",
    ],
    order: 0,
  },
  {
    role: "Accountant | Receivable Management Supervision",
    organization: "AK Electronics",
    period: "Nov 2018 – Present",
    kind: "finance",
    summary: "Own full-cycle accounting and supervise receivable management — a live environment for the reporting discipline I bring to engineering.",
    highlights: [
      "Supervise receivable management, client reconciliation, and collection follow-up",
      "Prepared daily cash flow reports, general ledgers, and tax compliance filings",
      "Managed monthly balance reconciliations and client account management",
      "Built financial MIS reports for senior management decision-making",
    ],
    order: 1,
  },
  {
    role: "Receivable Management Supervisor",
    organization: "Digicom QMobile (Pvt) Ltd",
    period: "Mar 2014 – Nov 2017",
    kind: "finance",
    summary: "Led receivables reconciliation across South Pakistan — large-scale data accuracy under deadlines.",
    highlights: [
      "Reconciled receivables across South Pakistan; produced DBC reports and sales-vs-return analysis",
      "Maintained Oracle ERP updates and built MIS reports and financial dashboards",
    ],
    order: 2,
  },
  {
    role: "Data Compilation Officer",
    organization: "Engro Fertilizers (Rahbar Project)",
    period: "Apr 2018 – Jul 2018",
    kind: "finance",
    summary: "Ensured data integrity for a farmer-verification program.",
    highlights: [
      "Verified farmer documents and land status records",
      "Maintained data integrity and compliance across the program database",
    ],
    order: 3,
  },
];

const educationSeed = [
  {
    degree: "B.Com (Bachelor of Commerce)",
    institution: "University of Karachi",
    period: "In Progress",
    note: "Continuing part-time alongside full-time engineering work.",
    order: 0,
  },
  {
    degree: "Intermediate (Pre-Medical)",
    institution: "Crescent Degree College, Karachi",
    period: "Completed",
    order: 1,
  },
];

const skillsSeed = [
  // Frontend
  { name: "HTML5 & CSS3", category: "frontend", order: 0 },
  { name: "JavaScript (ES6+)", category: "frontend", order: 1 },
  { name: "React.js", category: "frontend", order: 2 },
  { name: "React Hooks & Context API", category: "frontend", order: 3 },
  { name: "Tailwind CSS", category: "frontend", order: 4 },
  { name: "Responsive / Mobile-First Design", category: "frontend", order: 5 },
  // Backend
  { name: "Node.js", category: "backend", order: 0 },
  { name: "Express.js", category: "backend", order: 1 },
  { name: "MongoDB & Mongoose", category: "backend", order: 2 },
  { name: "JWT / Session Auth", category: "backend", order: 3 },
  { name: "REST API Design", category: "backend", order: 4 },
  { name: "Third-Party Integrations", category: "backend", order: 5 },
  { name: "Socket.IO", category: "backend", order: 6 },
  // AI
  { name: "Antigravity", category: "ai", order: 0 },
  { name: "OpenAI Codex", category: "ai", order: 1 },
  { name: "Qwen", category: "ai", order: 2 },
  { name: "OpenCode", category: "ai", order: 3 },
  { name: "Prompt Engineering", category: "ai", order: 4 },
  { name: "AI Agent Workflows", category: "ai", order: 5 },
  // Deployment
  { name: "Vercel", category: "deployment", order: 0 },
  { name: "Railway", category: "deployment", order: 1 },
  { name: "GitHub Actions", category: "deployment", order: 2 },
  { name: "Environment Management", category: "deployment", order: 3 },
  { name: "Serverless Patterns", category: "deployment", order: 4 },
  // Tools
  { name: "Git & GitHub", category: "tools", order: 0 },
  { name: "VS Code", category: "tools", order: 1 },
  { name: "Postman", category: "tools", order: 2 },
  { name: "npm", category: "tools", order: 3 },
  { name: "Agile Collaboration", category: "tools", order: 4 },
  { name: "Playwright", category: "tools", order: 5 },
];

const certificationsSeed = [
  {
    title: "Backend Development — Node.js, MongoDB, Express.js",
    issuer: "Bano Qabil 4.0",
    batch: "Fall",
    order: 0,
  },
  {
    title: "React.js Course",
    issuer: "Bano Qabil 4.0",
    batch: "",
    order: 1,
  },
  {
    title: "Web Development — HTML, CSS, JavaScript",
    issuer: "Bano Qabil 3.0",
    batch: "",
    order: 2,
  },
  {
    title: "Computerized Accounting",
    issuer: "Sindh Board of Technical Education",
    batch: "A+ Grade",
    order: 3,
  },
  {
    title: "Intermediate (Pre-Medical)",
    issuer: "Crescent Degree College, Karachi",
    batch: "Completed",
    order: 4,
  },
];

const achievementsSeed = [
  {
    title: "Shipped a real-time live-scoring platform end-to-end",
    detail: "BQ-PLAY: MERN + Socket.IO, 25-page user app, 20-page admin console, 22 models, AI commentary integration.",
    icon: "trophy",
    order: 0,
  },
  {
    title: "3 Bano Qabil technical certifications",
    detail: "Backend (Node/Mongo/Express), React.js, and Web Development fundamentals.",
    icon: "award",
    order: 1,
  },
  {
    title: "10+ years of professional financial & analytical experience",
    detail: "From receivable management across South Pakistan to full-cycle accounting.",
    icon: "briefcase",
    order: 2,
  },
  {
    title: "Pioneering AI-augmented workflows",
    detail: "Integrated Antigravity, Codex, Qwen, and OpenCode into real project workflows.",
    icon: "sparkles",
    order: 3,
  },
  {
    title: "Tested production apps with Playwright",
    detail: "End-to-end test suites written for full-stack applications.",
    icon: "shield",
    order: 4,
  },
];

const projectsSeed = [
  {
    slug: "bq-play",
    name: "BQ-PLAY (CricAll)",
    tagline: "Live cricket scoring & tournament platform",
    description:
      "My flagship full-stack project at Bano Qabil Incubation Center. A live cricket scoring and tournament platform with a public user app (match center, live scores, rankings, points tables, news, videos), a dedicated admin scoring console (ball-by-ball scoring, wagon wheel, pitch maps, DRS review, super-over and tie resolution), and a Node/Express + Socket.IO backend.",
    features: [
      "Real-time score updates via Socket.IO (WebSocket) across user and admin apps",
      "Ball-by-ball live scoring console with full match setup wizard (format, XI, toss, openers)",
      "AI-powered commentary generation through Anthropic Claude",
      "Match detail pages: Live, Scorecard, Commentary, Partnerships, Graphs, Info tabs",
      "Series/tournaments, team & player profiles, rankings and points tables",
      "22 MongoDB models and 20+ REST route groups on the backend",
    ],
    stack: ["React", "Redux Toolkit", "React Query", "Socket.IO", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Anthropic Claude API"],
    category: "flagship",
    status: "live",
    statusNote: "Deployed on Vercel + Railway. Direct URLs pending confirmation via dashboard.",
    repoUrl: "https://github.com/Abid-Tanoli/BQ-PLAY",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/BQ-PLAY" }],
    startedAt: "2026-01-12",
    isFeatured: true,
    repoNames: ["BQ-PLAY"],
    order: 0,
  },
  {
    slug: "lowpricemart",
    name: "LowPriceMart",
    tagline: "Full-stack e-commerce platform",
    description:
      "A complete three-tier e-commerce application: a customer storefront, a separate admin dashboard with sales analytics (Recharts), and a Node.js/Express backend with MongoDB. Authentication via JWT, image uploads via Cloudinary, transactional emails via Nodemailer, and Zod validation on every input — plus an end-to-end Playwright test suite.",
    features: [
      "Separate user and admin React frontends with Redux Toolkit state management",
      "Admin analytics dashboard with charts (Recharts)",
      "JWT authentication, Cloudinary image uploads, Nodemailer email flows",
      "Zod validation across the full stack",
      "Playwright end-to-end test suite",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Redux Toolkit", "Recharts", "Node.js", "Express", "MongoDB", "JWT", "Cloudinary", "Nodemailer", "Zod", "Playwright"],
    category: "full-stack",
    status: "in-progress",
    statusNote: "Actively developed (most recent pushes). Live deployment pending confirmation.",
    repoUrl: "https://github.com/Abid-Tanoli/LowPriceMart",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/LowPriceMart" }],
    startedAt: "2025-12-04",
    isFeatured: true,
    repoNames: ["LowPriceMart"],
    order: 1,
  },
  {
    slug: "event-organizer",
    name: "Event Organizer",
    tagline: "Event booking & management platform (TypeScript)",
    description:
      "A full-stack event booking and management platform built with React, TypeScript, Node.js, Express, and MongoDB. Feature modules for authentication, users, admins, events, and categories with JWT auth, a Vercel serverless entry point for the API, and a clean layered project structure.",
    features: [
      "Auth module: register, login, JWT sessions",
      "User, admin, event, and category management modules",
      "TypeScript across backend and frontend",
      "Vercel serverless-ready API entry point",
    ],
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "JWT", "Vercel"],
    category: "full-stack",
    status: "verify",
    statusNote: "A Vercel URL is configured on the repo but currently returns 404.",
    repoUrl: "https://github.com/Abid-Tanoli/Event-Organizer",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/Event-Organizer" }],
    startedAt: "2026-02-03",
    isFeatured: true,
    repoNames: ["Event-Organizer"],
    order: 2,
  },
  {
    slug: "tourist-places-guide",
    name: "Tourist Places Guide",
    tagline: "MERN travel guide with user & admin apps",
    description:
      "A MERN-stack tourist places guide with separate user and admin React (Vite) frontends connected to a Node.js, Express.js, MongoDB, and Mongoose backend.",
    features: [
      "User and admin React frontends (Vite)",
      "Express + Mongoose backend with environment-driven config",
      "Full CRUD for tourist places and categories",
    ],
    stack: ["React", "Vite", "Node.js", "Express", "MongoDB", "Mongoose"],
    category: "full-stack",
    status: "in-progress",
    statusNote: "Active development. Deployment pending.",
    repoUrl: "https://github.com/Abid-Tanoli/tourist-places-guide",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/tourist-places-guide" }],
    startedAt: "2026-07-09",
    isFeatured: false,
    repoNames: ["tourist-places-guide"],
    order: 3,
  },
  {
    slug: "ecommerce",
    name: "ECommerce (Learning)",
    tagline: "Self-learning e-commerce build",
    description:
      "An early e-commerce application built during the self-learning phase of the backend curriculum — the foundation that led to LowPriceMart.",
    features: ["Product listings and cart flows", "First pass at REST API design"],
    stack: ["JavaScript", "Node.js", "Express", "MongoDB"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/ECommerce",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/ECommerce" }],
    startedAt: "2025-11-04",
    isFeatured: false,
    repoNames: ["ECommerce"],
    order: 4,
  },
  {
    slug: "web-3-backend",
    name: "Web-3 Bano Qabil Backend",
    tagline: "Bano Qabil 4.0 backend coursework",
    description:
      "Backend coursework from the Bano Qabil 4.0 program: Node.js, Express, and MongoDB patterns in TypeScript.",
    features: ["Express server patterns in TypeScript", "MongoDB + Mongoose fundamentals"],
    stack: ["TypeScript", "Node.js", "Express", "MongoDB"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/Web-3-Bano-Qabil-Backend",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/Web-3-Bano-Qabil-Backend" }],
    startedAt: "2025-11-21",
    isFeatured: false,
    repoNames: ["Web-3-Bano-Qabil-Backend"],
    order: 5,
  },
  {
    slug: "web-2-assignments",
    name: "Web-2 Bano Qabil",
    tagline: "JavaScript fundamentals & assignments",
    description:
      "JavaScript solutions for Web Development 2 assignments — logic building, array/object methods.",
    features: ["Logic-building exercises", "Array/object method practice"],
    stack: ["JavaScript"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/Web-2-Bano-Qabil",
    links: [{ label: "Source Code", url: "https://github.com/Abid-Tanoli/Web-2-Bano-Qabil" }],
    startedAt: "2025-07-21",
    isFeatured: false,
    repoNames: ["Web-2-Bano-Qabil"],
    order: 6,
  },
  {
    slug: "web-dev-1-projects",
    name: "Web Dev 1 - Final & Mid-Term",
    tagline: "Bano Qabil web development coursework",
    description:
      "Final project and mid-term work from the Bano Qabil Web Development 1 course.",
    features: ["Responsive HTML/CSS layouts", "Course projects from Web Dev 1"],
    stack: ["HTML", "CSS"],
    category: "coursework",
    status: "archived",
    repoUrl: "https://github.com/Abid-Tanoli/Final-Project-Web-dev-1",
    links: [
      { label: "Final Project", url: "https://github.com/Abid-Tanoli/Final-Project-Web-dev-1" },
      { label: "Mid-Term", url: "https://github.com/Abid-Tanoli/Mid-Term_Web-dev-1" },
    ],
    startedAt: "2024-08-20",
    isFeatured: false,
    repoNames: ["Final-Project-Web-dev-1"],
    order: 7,
  },
];

async function runMigration() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI environment variable is missing!");
    process.exit(1);
  }

  console.log("🔄 Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB Connected.\n");

  // 1. Admin Seed
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "visionaryabidi@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "change_this_admin_password_123";

  let admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    admin = await Admin.create({ email: adminEmail, passwordHash });
    console.log(`👤 Created Admin Account: ${adminEmail}`);
  } else {
    console.log(`👤 Admin Account Exists: ${adminEmail}`);
  }

  // 2. Profile Seed
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create(profileSeed);
    console.log("📄 Created Singleton Profile document");
  } else {
    console.log("📄 Profile document already exists — keeping current DB values");
  }

  // 3. Projects Seed
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany(projectsSeed);
    console.log(`🚀 Migrated ${projectsSeed.length} Projects into MongoDB`);
  } else {
    console.log(`🚀 Projects collection already contains ${projectCount} items`);
  }

  // 4. Experience Seed
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany(experienceSeed);
    console.log(`💼 Migrated ${experienceSeed.length} Experience records`);
  } else {
    console.log(`💼 Experience collection contains ${expCount} items`);
  }

  // 5. Education Seed
  const eduCount = await Education.countDocuments();
  if (eduCount === 0) {
    await Education.insertMany(educationSeed);
    console.log(`🎓 Migrated ${educationSeed.length} Education records`);
  } else {
    console.log(`🎓 Education collection contains ${eduCount} items`);
  }

  // 6. Skills Seed
  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany(skillsSeed);
    console.log(`⚡ Migrated ${skillsSeed.length} Skills`);
  } else {
    console.log(`⚡ Skills collection contains ${skillCount} items`);
  }

  // 7. Certifications Seed
  const certCount = await Certification.countDocuments();
  if (certCount === 0) {
    await Certification.insertMany(certificationsSeed);
    console.log(`📜 Migrated ${certificationsSeed.length} Certifications`);
  } else {
    console.log(`📜 Certifications collection contains ${certCount} items`);
  }

  // 8. Achievements Seed
  const achCount = await Achievement.countDocuments();
  if (achCount === 0) {
    await Achievement.insertMany(achievementsSeed);
    console.log(`🏆 Migrated ${achievementsSeed.length} Achievements`);
  } else {
    console.log(`🏆 Achievements collection contains ${achCount} items`);
  }

  console.log("\n✨ Seed data migration complete!");
  await mongoose.disconnect();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
