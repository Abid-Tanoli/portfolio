export type RoleKind = "tech" | "finance";

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  kind: RoleKind;
  summary: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  note?: string;
}
