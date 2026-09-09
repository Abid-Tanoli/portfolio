import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  detail: string;
  icon: string;
  order: number;
  isVisible: boolean;
}

const AchievementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    detail: { type: String, required: true },
    icon: { type: String, default: "award" },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);
