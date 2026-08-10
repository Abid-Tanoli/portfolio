import mongoose, { Schema, Document } from "mongoose";

export interface ISkillGroup {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface ISkill extends Document {
  name: string;
  category: "frontend" | "backend" | "ai" | "deployment" | "tools";
  icon?: string;
  order: number;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["frontend", "backend", "ai", "deployment", "tools"],
      required: true,
    },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
