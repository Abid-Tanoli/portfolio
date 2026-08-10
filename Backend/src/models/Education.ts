import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  institution: string;
  period: string;
  note?: string;
  order: number;
}

const EducationSchema: Schema = new Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    period: { type: String, required: true },
    note: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Education = mongoose.models.Education || mongoose.model<IEducation>("Education", EducationSchema);
