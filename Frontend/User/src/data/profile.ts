import type {
  Achievement,
  Certification,
  Education,
  Experience,
  SkillGroup,
} from "@/types";

export const profile = {
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
  resumeUrl: "",
};

export const heroSublines = [
  "MERN Stack Developer",
  "AI-Augmented Development",
  "REST API Design",
  "Financial Analysis",
];

export const heroSummary =
  "Full Stack Web Developer building real products with the MERN stack — and a growing specialization in AI-augmented development, using tools like Antigravity, Codex, Qwen, and OpenCode to ship faster and smarter. Currently building BQ-PLAY, a live cricket scoring platform, at Bano Qabil Incubation Center.";

export const aboutSummary = [
  "I'm a Full Stack Web Developer with hands-on MERN expertise — MongoDB, Express.js, React.js, and Node.js — and a fast-growing specialization in AI-augmented development. I integrate modern AI coding tools (Antigravity, OpenAI Codex, Qwen, OpenCode) directly into my workflow to design, build, and debug features faster without compromising quality.",
  "I'm currently an intern at Bano Qabil Incubation Center, where I'm building BQ-PLAY — a live cricket scoring platform with real-time updates, an admin scoring console, and player statistics. I work in an agile team with Git/GitHub, design REST APIs and MongoDB schemas, and ship responsive React frontends end-to-end.",
  "What sets me apart: 8+ years of professional experience in Accounting & Finance. I've built financial MIS dashboards, managed receivables across South Pakistan, and filed tax reports — so I bring analytical rigor, structured problem-solving, and a business mindset to every engineering decision.",
];

export const careerGoals =
  "I'm on a trajectory from full stack development to AI-augmented engineering: building tools that combine the MERN stack with AI agents, prompt-driven workflows, and real-time systems — while keeping the financial discipline and analytical rigor I've carried from a decade in accounting.";

export const experience: Experience[] = [
  {
    id: "bq-play",
    role: "Full Stack Web Development Intern",
    organization: "Bano Qabil Incubation Center",
    period: "Apr 2025 – Present",
    kind: "tech",
    summary:
      "Building production MERN applications in an agile team — from schema design to deployment.",
    highlights: [
      "Built and deployed BQ-PLAY, a live cricket scoring platform with real-time updates (MERN + Socket.IO)",
      "Designing REST APIs and MongoDB schemas for a 20+ route, 22-model backend",
      "Integrating AI coding tools (Antigravity, Codex, Qwen, OpenCode) into daily workflows",
      "Shipping responsive React frontends and collaborating via Git/GitHub in agile sprints",
    ],
  },
  {
    id: "ak-electronics",
    role: "Accountant | Receivable Management Supervision",
    organization: "AK Electronics",
    period: "Nov 2018 – Present",
    kind: "finance",
    summary:
      "Own full-cycle accounting and supervise receivable management — a live environment for the reporting discipline I bring to engineering.",
    highlights: [
      "Supervise receivable management, client reconciliation, and collection follow-up",
      "Prepared daily cash flow reports, general ledgers, and tax compliance filings",
      "Managed monthly balance reconciliations and client account management",
      "Built financial MIS reports for senior management decision-making",
    ],
  },
  {
    id: "digicom",
    role: "Receivable Management Supervisor",
    organization: "Digicom QMobile (Pvt) Ltd",
    period: "Mar 2014 – Nov 2017",
    kind: "finance",
    summary:
      "Led receivables reconciliation across South Pakistan — large-scale data accuracy under deadlines.",
    highlights: [
      "Reconciled receivables across South Pakistan; produced DBC reports and sales-vs-return analysis",
      "Maintained Oracle ERP updates and built MIS reports and financial dashboards",
    ],
  },
  {
    id: "engro",
    role: "Data Compilation Officer",
    organization: "Engro Fertilizers (Rahbar Project)",
    period: "Apr 2018 – Jul 2018",
    kind: "finance",
    summary: "Ensured data integrity for a farmer-verification program.",
    highlights: [
      "Verified farmer documents and land status records",
      "Maintained data integrity and compliance across the program database",
    ],
  },
];

export const education: Education[] = [
  {
    id: "bcom",
    degree: "B.Com (Bachelor of Commerce)",
    institution: "University of Karachi",
    period: "In Progress",
    note: "Continuing part-time alongside full-time engineering work.",
  },
  {
    id: "intermediate",
    degree: "Intermediate (Pre-Medical)",
    institution: "Crescent Degree College, Karachi",
    period: "Completed",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Building responsive, accessible interfaces",
    skills: [
      "HTML5 & CSS3",
      "JavaScript (ES6+)",
      "React.js",
      "React Hooks & Context API",
      "Tailwind CSS",
      "Responsive / Mobile-First Design",
    ],
  },
  {
    id: "backend",
    title: "Backend & Database",
    description: "APIs, auth, and data modeling",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB & Mongoose",
      "JWT / Session Auth",
      "REST API Design",
      "Third-Party Integrations",
      "Socket.IO",
    ],
  },
  {
    id: "ai",
    title: "AI-Augmented Development",
    description: "Shipping faster with AI agents in the loop",
    skills: [
      "Antigravity",
      "OpenAI Codex",
      "Qwen",
      "OpenCode",
      "Prompt Engineering",
      "AI Agent Workflows",
    ],
  },
  {
    id: "deployment",
    title: "Deployment & DevOps",
    description: "From localhost to production",
    skills: ["Vercel", "Railway", "GitHub Actions", "Environment Management", "Serverless Patterns"],
  },
  {
    id: "tools",
    title: "Tools & Workflow",
    description: "The daily toolkit",
    skills: ["Git & GitHub", "VS Code", "Postman", "npm", "Agile Collaboration", "Playwright"],
  },
];

export const certifications: Certification[] = [
  {
    id: "bq-backend",
    title: "Backend Development — Node.js, MongoDB, Express.js",
    issuer: "Bano Qabil 4.0",
    batch: "Fall",
  },
  {
    id: "bq-react",
    title: "React.js Course",
    issuer: "Bano Qabil 4.0",
    batch: "",
  },
  {
    id: "bq-web",
    title: "Web Development — HTML, CSS, JavaScript",
    issuer: "Bano Qabil 3.0",
    batch: "",
  },
  {
    id: "sindh-accounting",
    title: "Computerized Accounting",
    issuer: "Sindh Board of Technical Education",
    batch: "A+ Grade",
  },
  {
    id: "crescent-inter",
    title: "Intermediate (Pre-Medical)",
    issuer: "Crescent Degree College, Karachi",
    batch: "Completed",
  },
];

export const achievements: Achievement[] = [
  {
    id: "bqplay",
    title: "Shipped a real-time live-scoring platform end-to-end",
    detail:
      "BQ-PLAY: MERN + Socket.IO, 25-page user app, 20-page admin console, 22 models, AI commentary integration.",
    icon: "trophy",
  },
  {
    id: "certs",
    title: "3 Bano Qabil technical certifications",
    detail: "Backend (Node/Mongo/Express), React.js, and Web Development fundamentals.",
    icon: "award",
  },
  {
    id: "finance",
    title: "10+ years of professional financial & analytical experience",
    detail: "From receivable management across South Pakistan to full-cycle accounting.",
    icon: "briefcase",
  },
  {
    id: "ai",
    title: "Pioneering AI-augmented workflows",
    detail: "Integrated Antigravity, Codex, Qwen, and OpenCode into real project workflows.",
    icon: "sparkles",
  },
  {
    id: "e2e",
    title: "Tested production apps with Playwright",
    detail: "End-to-end test suites written for full-stack applications.",
    icon: "shield",
  },
];
