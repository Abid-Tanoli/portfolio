export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "boolean"
  | "stringList"
  | "linkList"
  | "image";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  folder?: string;
  defaultValue?: unknown;
}

export interface ResourceConfig {
  key: string;
  endpoint: string;
  listEndpoint?: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  columns: { name: string; label: string; max?: number }[];
  createLabel: string;
  /** If the GET endpoint returns a wrapped object, specify which key holds the array, e.g. "skills" or "projects" */
  arrayKey?: string;
}

const projectCategoryOptions = [
  { value: "flagship", label: "Flagship" },
  { value: "full-stack", label: "Full Stack" },
  { value: "ai", label: "AI" },
  { value: "coursework", label: "Coursework" },
];

const projectStatusOptions = [
  { value: "live", label: "Live" },
  { value: "in-progress", label: "In Progress" },
  { value: "verify", label: "Verify Deploy" },
  { value: "archived", label: "Archived" },
];

export const resourceConfigs: ResourceConfig[] = [
  {
    key: "projects",
    endpoint: "/projects",
    listEndpoint: "/projects/admin",
    arrayKey: "projects",
    title: "Projects",
    description: "Manage portfolio projects shown on the public site",
    createLabel: "New Project",
    columns: [
      { name: "name", label: "Name" },
      { name: "category", label: "Category" },
      { name: "status", label: "Status" },
      { name: "isFeatured", label: "Featured" },
    ],
    fields: [
      { name: "name", label: "Project Name", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true, help: "Unique URL identifier, e.g. bq-play" },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "category", label: "Category", type: "select", options: projectCategoryOptions, required: true },
      { name: "status", label: "Status", type: "select", options: projectStatusOptions, required: true },
      { name: "statusNote", label: "Status Note", type: "text", placeholder: "e.g. Deployed on Vercel + Railway" },
      { name: "repoUrl", label: "Repository URL", type: "text", required: true },
      { name: "repoNames", label: "Repo Names (GitHub enrichment)", type: "stringList", help: "One GitHub repo per line, e.g. BQ-PLAY" },
      { name: "features", label: "Key Features", type: "stringList", help: "One feature per line" },
      { name: "stack", label: "Tech Stack", type: "stringList", help: "One technology per line" },
      { name: "links", label: "Links", type: "linkList", help: "One label:url per line, e.g. Source Code:https://..." },
      { name: "screenshotUrls", label: "Screenshots", type: "stringList", help: "One image URL per line" },
      { name: "startedAt", label: "Started At", type: "text", placeholder: "YYYY-MM-DD" },
      { name: "order", label: "Order", type: "number" },
      { name: "isFeatured", label: "Featured Project", type: "boolean" },
    ],
  },
  {
    key: "skills",
    endpoint: "/skills",
    listEndpoint: "/skills/admin",
    arrayKey: "skills",
    title: "Skills",
    description: "Manage the skills taxonomy shown in the Skills section",
    createLabel: "New Skill",
    columns: [
      { name: "name", label: "Skill" },
      { name: "category", label: "Category" },
      { name: "order", label: "Order" },
    ],
    fields: [
      { name: "name", label: "Skill Name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "frontend", label: "Frontend" },
          { value: "backend", label: "Backend & Database" },
          { value: "ai", label: "AI-Augmented Development" },
          { value: "deployment", label: "Deployment & DevOps" },
          { value: "tools", label: "Tools & Workflow" },
        ],
      },
      { name: "icon", label: "Icon", type: "text", placeholder: "Optional icon key" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "experience",
    endpoint: "/experience",
    listEndpoint: "/experience/admin",
    title: "Experience",
    description: "Work history shown on the About page timeline",
    createLabel: "New Experience",
    columns: [
      { name: "role", label: "Role" },
      { name: "organization", label: "Organization" },
      { name: "period", label: "Period" },
      { name: "kind", label: "Kind" },
    ],
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text", required: true },
      { name: "period", label: "Period", type: "text", required: true, placeholder: "e.g. Apr 2025 – Present" },
      { name: "kind", label: "Kind", type: "select", options: [
        { value: "tech", label: "Tech" },
        { value: "finance", label: "Finance" },
      ] },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "highlights", label: "Highlights", type: "stringList", help: "One highlight per line" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "education",
    endpoint: "/education",
    listEndpoint: "/education/admin",
    title: "Education",
    description: "Education entries on the About page timeline",
    createLabel: "New Education",
    columns: [
      { name: "degree", label: "Degree" },
      { name: "institution", label: "Institution" },
      { name: "period", label: "Period" },
    ],
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "period", label: "Period", type: "text", required: true },
      { name: "note", label: "Note", type: "text" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "certifications",
    endpoint: "/certifications",
    listEndpoint: "/certifications/admin",
    title: "Certifications",
    description: "Certification gallery on the public site",
    createLabel: "New Certification",
    columns: [
      { name: "title", label: "Title" },
      { name: "issuer", label: "Issuer" },
      { name: "batch", label: "Batch" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", required: true },
      { name: "batch", label: "Batch / Grade", type: "text" },
      { name: "imageUrl", label: "Certificate Image", type: "image", folder: "certs" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "achievements",
    endpoint: "/achievements",
    listEndpoint: "/achievements/admin",
    title: "Achievements",
    description: "Highlights shown in the Achievements grid",
    createLabel: "New Achievement",
    columns: [
      { name: "title", label: "Title" },
      { name: "icon", label: "Icon" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "detail", label: "Detail", type: "textarea", required: true },
      { name: "icon", label: "Icon", type: "select", options: [
        { value: "trophy", label: "Trophy" },
        { value: "award", label: "Award" },
        { value: "briefcase", label: "Briefcase" },
        { value: "sparkles", label: "Sparkles" },
        { value: "shield", label: "Shield" },
      ] },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "testimonials",
    endpoint: "/testimonials",
    listEndpoint: "/testimonials/all",
    title: "Testimonials",
    description: "Approve and manage testimonials (only approved ones appear publicly)",
    createLabel: "New Testimonial",
    columns: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "approved", label: "Approved" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role / Title", type: "text", required: true },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "avatarUrl", label: "Avatar Image", type: "image", folder: "avatars" },
      { name: "approved", label: "Approved (visible publicly)", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
];

export function getResourceConfig(key: string): ResourceConfig | undefined {
  return resourceConfigs.find((r) => r.key === key);
}

export function emptyRecord(config: ResourceConfig): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const field of config.fields) {
    switch (field.type) {
      case "boolean":
        record[field.name] = false;
        break;
      case "number":
        record[field.name] = 0;
        break;
      case "stringList":
        record[field.name] = [];
        break;
      case "linkList":
        record[field.name] = [];
        break;
      case "select":
        record[field.name] = field.defaultValue ?? field.options?.[0]?.value ?? "";
        break;
      default:
        record[field.name] = field.defaultValue ?? "";
    }
  }
  return record;
}
