import mongoose, { Schema, Document } from "mongoose";

export interface IProjectLink {
  label: string;
  url: string;
}

export interface IProject extends Document {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  stack: string[];
  category: "flagship" | "full-stack" | "ai" | "coursework";
  status: "live" | "in-progress" | "archived" | "verify";
  statusNote?: string;
  repoUrl: string;
  links: IProjectLink[];
  startedAt: string;
  isFeatured: boolean;
  repoNames: string[];
  screenshotUrls: string[];
  order: number;
}

const ProjectSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    stack: [{ type: String }],
    category: {
      type: String,
      enum: ["flagship", "full-stack", "ai", "coursework"],
      default: "full-stack",
    },
    status: {
      type: String,
      enum: ["live", "in-progress", "archived", "verify"],
      default: "in-progress",
    },
    statusNote: { type: String },
    repoUrl: { type: String, required: true },
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    startedAt: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    repoNames: [{ type: String }],
    screenshotUrls: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
