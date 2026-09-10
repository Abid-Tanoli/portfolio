import { createContext, useContext, type ReactNode } from "react";
import { achievements } from "@/data/achievements";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import type { Profile, SkillGroup } from "@/types";

export interface PortfolioContent {
  profile: Profile;
  heroSublines: string[];
  heroSummary: string;
  aboutSummary: string[];
  careerGoals: string;
  experience: typeof experience;
  education: typeof education;
  skillGroups: SkillGroup[];
  certifications: typeof certifications;
  achievements: typeof achievements;
  live: boolean;
}

const staticContent: PortfolioContent = {
  profile,
  heroSublines: profile.heroSublines,
  heroSummary: profile.heroSummary,
  aboutSummary: profile.aboutSummary,
  careerGoals: profile.careerGoals,
  experience,
  education,
  skillGroups,
  certifications,
  achievements,
  live: true,
};

const PortfolioContext = createContext<PortfolioContent>(staticContent);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  return <PortfolioContext.Provider value={staticContent}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContent {
  return useContext(PortfolioContext);
}
