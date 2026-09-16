import type { Skill, SkillExportGroup } from "@/types";

export const skills: Skill[] = [
  ["6aa3ebcdf04f69966d42cfed", "Vercel", "deployment", 0], ["6aa3ebcdf04f69966d42cfe0", "Node.js", "backend", 0], ["6aa3ebcdf04f69966d42cfda", "HTML5 & CSS3", "frontend", 0], ["6aa3ebcdf04f69966d42cfe7", "Antigravity", "ai", 0], ["6aa3ebcdf04f69966d42cff2", "Git & GitHub", "tools", 0],
  ["6aa3ebcdf04f69966d42cfdb", "JavaScript (ES6+)", "frontend", 1], ["6aa3ebcdf04f69966d42cfee", "Railway", "deployment", 1], ["6aa3ebcdf04f69966d42cfe1", "Express.js", "backend", 1], ["6aa3ebcdf04f69966d42cfe8", "OpenAI Codex", "ai", 1], ["6aa3ebcdf04f69966d42cff3", "VS Code", "tools", 1],
  ["6aa3ebcdf04f69966d42cfe9", "Qwen", "ai", 2], ["6aa3ebcdf04f69966d42cfe2", "MongoDB & Mongoose", "backend", 2], ["6aa3ebcdf04f69966d42cfdc", "React.js", "frontend", 2], ["6aa3ebcdf04f69966d42cff4", "Postman", "tools", 2], ["6aa3ebcdf04f69966d42cfef", "GitHub Actions", "deployment", 2],
  ["6aa3ebcdf04f69966d42cfe3", "JWT / Session Auth", "backend", 3], ["6aa3ebcdf04f69966d42cfea", "OpenCode", "ai", 3], ["6aa3ebcdf04f69966d42cfdd", "React Hooks & Context API", "frontend", 3], ["6aa3ebcdf04f69966d42cff5", "npm", "tools", 3], ["6aa3ebcdf04f69966d42cff0", "Environment Management", "deployment", 3],
  ["6aa3ebcdf04f69966d42cfe4", "REST API Design", "backend", 4], ["6aa3ebcdf04f69966d42cfeb", "Prompt Engineering", "ai", 4], ["6aa3ebcdf04f69966d42cfde", "Tailwind CSS", "frontend", 4], ["6aa3ebcdf04f69966d42cff6", "Agile Collaboration", "tools", 4], ["6aa3ebcdf04f69966d42cff1", "Serverless Patterns", "deployment", 4],
  ["6aa3ebcdf04f69966d42cfdf", "Responsive / Mobile-First Design", "frontend", 5], ["6aa3ebcdf04f69966d42cfec", "AI Agent Workflows", "ai", 5], ["6aa3ebcdf04f69966d42cfe5", "Third-Party Integrations", "backend", 5], ["6aa3ebcdf04f69966d42cff7", "Playwright", "tools", 5], ["6aa3ebcdf04f69966d42cfe6", "Socket.IO", "backend", 6],
].map(([id, name, category, order]) => ({ id, name, category, order } as Skill));

export const skillGroups: SkillExportGroup[] = [
  { id: "frontend", title: "Frontend", description: "Building responsive, accessible interfaces", skills: ["HTML5 & CSS3", "JavaScript (ES6+)", "React.js", "React Hooks & Context API", "Tailwind CSS", "Responsive / Mobile-First Design"], records: skills.filter((skill) => skill.category === "frontend") },
  { id: "backend", title: "Backend & Database", description: "APIs, auth, and data modeling", skills: ["Node.js", "Express.js", "MongoDB & Mongoose", "JWT / Session Auth", "REST API Design", "Third-Party Integrations", "Socket.IO"], records: skills.filter((skill) => skill.category === "backend") },
  { id: "ai", title: "AI-Augmented Development", description: "Shipping faster with AI agents in the loop", skills: ["Antigravity", "OpenAI Codex", "Qwen", "OpenCode", "Prompt Engineering", "AI Agent Workflows"], records: skills.filter((skill) => skill.category === "ai") },
  { id: "deployment", title: "Deployment & DevOps", description: "From localhost to production", skills: ["Vercel", "Railway", "GitHub Actions", "Environment Management", "Serverless Patterns"], records: skills.filter((skill) => skill.category === "deployment") },
  { id: "tools", title: "Tools & Workflow", description: "The daily toolkit", skills: ["Git & GitHub", "VS Code", "Postman", "npm", "Agile Collaboration", "Playwright"], records: skills.filter((skill) => skill.category === "tools") },
];
