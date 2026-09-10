export type RoleKind = "tech" | "finance";

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  kind: RoleKind;
  summary: string;
  highlights: string[];
  order?: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  note?: string;
  order?: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
