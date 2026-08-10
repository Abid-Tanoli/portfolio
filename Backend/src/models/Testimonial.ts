import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  approved: boolean;
  order: number;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, required: true },
    avatarUrl: { type: String },
    approved: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
