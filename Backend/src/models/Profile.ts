import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  firstName: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  location: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  linkedinPending: boolean;
  resumeUrl: string;
  resumeSummary: string;
  resumeUpdatedAt?: Date;
  profilePictureUrl: string;
  heroSublines: string[];
  heroSummary: string;
  aboutSummary: string[];
  careerGoals: string;
}

const ProfileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    phoneDisplay: { type: String, required: true },
    location: { type: String, required: true },
    github: { type: String, required: true },
    githubUsername: { type: String, required: true },
    linkedin: { type: String, default: "" },
    linkedinPending: { type: Boolean, default: true },
    resumeUrl: { type: String, default: "/resume.pdf" },
    resumeSummary: { type: String, default: "" },
    resumeUpdatedAt: { type: Date },
    profilePictureUrl: { type: String, default: "" },
    heroSublines: [{ type: String }],
    heroSummary: { type: String, required: true },
    aboutSummary: [{ type: String }],
    careerGoals: { type: String, required: true },
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
