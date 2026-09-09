import mongoose, { Schema, Document } from "mongoose";

export interface ICertification extends Document {
  title: string;
  issuer: string;
  batch: string;
  imageUrl?: string;
  order: number;
  isVisible: boolean;
}

const CertificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    batch: { type: String, default: "" },
    imageUrl: { type: String },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Certification = mongoose.models.Certification || mongoose.model<ICertification>("Certification", CertificationSchema);
