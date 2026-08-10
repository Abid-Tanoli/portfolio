import mongoose, { Schema, Document } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
  read: boolean;
}

const ContactSubmissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>("ContactSubmission", ContactSubmissionSchema);
