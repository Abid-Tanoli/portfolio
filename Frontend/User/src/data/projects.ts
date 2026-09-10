import type { Project } from "@/types";

export const projects: Project[] = [];

export const categoryLabels: Record<string, string> = {
	flagship: "Flagship",
	"full-stack": "Full Stack",
	coursework: "Coursework",
};

export const statusLabels: Record<string, string> = {
	live: "Live",
	"in-progress": "In Progress",
	archived: "Archived",
	verify: "Needs Verification",
};
