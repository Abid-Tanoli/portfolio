import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  role: string;
  organization: string;
  period: string;
  kind: "tech" | "finance";
  summary: string;
  highlights: string[];
  order: number;
  isVisible: boolean;
}

const ExperienceSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    organization: { type: String, required: true },
    period: { type: String, required: true },
    kind: { type: String, enum: ["tech", "finance"], default: "tech" },
    summary: { type: String, required: true },
    highlights: [{ type: String }],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Experience = mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);
