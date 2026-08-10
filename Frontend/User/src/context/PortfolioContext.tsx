import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchJson } from "@/lib/api";
import type { Achievement, Certification, Education, Experience, SkillGroup } from "@/types";
import {
  aboutSummary as staticAboutSummary,
  achievements as staticAchievements,
  careerGoals as staticCareerGoals,
  certifications as staticCertifications,
  education as staticEducation,
  experience as staticExperience,
  heroSublines as staticHeroSublines,
  heroSummary as staticHeroSummary,
  profile as staticProfile,
  skillGroups as staticSkillGroups,
} from "@/data/profile";

export type PortfolioProfile = typeof staticProfile & {
  heroSublines?: string[];
  heroSummary?: string;
  aboutSummary?: string[];
  careerGoals?: string;
  profilePictureUrl?: string;
};

export interface PortfolioContent {
  profile: PortfolioProfile;
  heroSublines: string[];
  heroSummary: string;
  aboutSummary: string[];
  careerGoals: string;
  experience: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  certifications: Certification[];
  achievements: Achievement[];
  live: boolean;
}

const staticContent: PortfolioContent = {
  profile: staticProfile,
  heroSublines: staticHeroSublines,
  heroSummary: staticHeroSummary,
  aboutSummary: staticAboutSummary,
  careerGoals: staticCareerGoals,
  experience: staticExperience,
  education: staticEducation,
  skillGroups: staticSkillGroups,
  certifications: staticCertifications,
  achievements: staticAchievements,
  live: false,
};

const PortfolioContext = createContext<PortfolioContent>(staticContent);

function idFromDoc(doc: { _id?: unknown; id?: string }, fallback: string): string {
  if (doc.id) return doc.id;
  if (doc._id != null) return String(doc._id);
  return fallback;
}

function mapExperience(docs: Array<Record<string, unknown>>): Experience[] {
  return docs.map((doc, i) => ({
    id: idFromDoc(doc as { _id?: unknown; id?: string }, `exp-${i}`),
    role: String(doc.role ?? ""),
    organization: String(doc.organization ?? ""),
    period: String(doc.period ?? ""),
    kind: (doc.kind as Experience["kind"]) ?? "tech",
    summary: String(doc.summary ?? ""),
    highlights: Array.isArray(doc.highlights) ? doc.highlights.map(String) : [],
  }));
}

function mapEducation(docs: Array<Record<string, unknown>>): Education[] {
  return docs.map((doc, i) => ({
    id: idFromDoc(doc as { _id?: unknown; id?: string }, `edu-${i}`),
    degree: String(doc.degree ?? ""),
    institution: String(doc.institution ?? ""),
    period: String(doc.period ?? ""),
    note: doc.note ? String(doc.note) : undefined,
  }));
}

function mapCertifications(docs: Array<Record<string, unknown>>): Certification[] {
  return docs.map((doc, i) => ({
    id: idFromDoc(doc as { _id?: unknown; id?: string }, `cert-${i}`),
    title: String(doc.title ?? ""),
    issuer: String(doc.issuer ?? ""),
    batch: String(doc.batch ?? ""),
    credential: doc.credential ? String(doc.credential) : undefined,
  }));
}

function mapAchievements(docs: Array<Record<string, unknown>>): Achievement[] {
  return docs.map((doc, i) => ({
    id: idFromDoc(doc as { _id?: unknown; id?: string }, `ach-${i}`),
    title: String(doc.title ?? ""),
    detail: String(doc.detail ?? ""),
    icon: String(doc.icon ?? "award"),
  }));
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(staticContent);

  useEffect(() => {
    if (window.__PRERENDER__) return;

    let cancelled = false;

    async function load() {
      const results = await Promise.allSettled([
        fetchJson<Record<string, unknown>>("/api/profile"),
        fetchJson<Array<Record<string, unknown>>>("/api/experience"),
        fetchJson<Array<Record<string, unknown>>>("/api/education"),
        fetchJson<{ groups: SkillGroup[] }>("/api/skills"),
        fetchJson<Array<Record<string, unknown>>>("/api/certifications"),
        fetchJson<Array<Record<string, unknown>>>("/api/achievements"),
      ]);

      if (cancelled) return;

      const [profileRes, experienceRes, educationRes, skillsRes, certsRes, achievementsRes] = results;

      let live = false;
      const next: PortfolioContent = { ...staticContent };

      if (profileRes.status === "fulfilled") {
        const apiProfile = profileRes.value;
        next.profile = { ...staticProfile, ...apiProfile } as PortfolioProfile;
        if (Array.isArray(apiProfile.heroSublines) && apiProfile.heroSublines.length > 0) {
          next.heroSublines = apiProfile.heroSublines.map(String);
          live = true;
        }
        if (typeof apiProfile.heroSummary === "string" && apiProfile.heroSummary) {
          next.heroSummary = apiProfile.heroSummary;
          live = true;
        }
        if (Array.isArray(apiProfile.aboutSummary) && apiProfile.aboutSummary.length > 0) {
          next.aboutSummary = apiProfile.aboutSummary.map(String);
          live = true;
        }
        if (typeof apiProfile.careerGoals === "string" && apiProfile.careerGoals) {
          next.careerGoals = apiProfile.careerGoals;
          live = true;
        }
        if (apiProfile.name || apiProfile.email) live = true;
      }

      if (experienceRes.status === "fulfilled" && experienceRes.value.length > 0) {
        next.experience = mapExperience(experienceRes.value);
        live = true;
      }

      if (educationRes.status === "fulfilled" && educationRes.value.length > 0) {
        next.education = mapEducation(educationRes.value);
        live = true;
      }

      if (skillsRes.status === "fulfilled" && skillsRes.value.groups?.some((g) => g.skills.length > 0)) {
        next.skillGroups = skillsRes.value.groups;
        live = true;
      }

      if (certsRes.status === "fulfilled" && certsRes.value.length > 0) {
        next.certifications = mapCertifications(certsRes.value);
        live = true;
      }

      if (achievementsRes.status === "fulfilled" && achievementsRes.value.length > 0) {
        next.achievements = mapAchievements(achievementsRes.value);
        live = true;
      }

      next.live = live;
      setContent(next);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => content, [content]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContent {
  return useContext(PortfolioContext);
}
