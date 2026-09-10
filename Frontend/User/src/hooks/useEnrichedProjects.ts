import type { EnrichedProject } from "@/types/project";
import { projects as curatedProjects } from "@/data/projects";

const staticProjects: EnrichedProject[] = curatedProjects.map((project) => ({
  ...project,
  language: null,
  stars: 0,
  forks: 0,
  topics: [],
}));

export function useEnrichedProjects() {
  return { projects: staticProjects, live: true, error: false };
}
