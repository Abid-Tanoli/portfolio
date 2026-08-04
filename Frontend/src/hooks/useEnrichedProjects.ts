import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/api";
import type { EnrichedProject } from "@/types/project";
import { projects as curatedProjects } from "@/data/projects";

interface ProjectsResponse {
  source: "github+curated" | "curated";
  projects: EnrichedProject[];
}

function fallbackProjects(): EnrichedProject[] {
  return curatedProjects.map((project) => ({
    ...project,
    language: null,
    stars: 0,
    forks: 0,
    topics: [],
  }));
}

export function useEnrichedProjects() {
  const [liveProjects, setLiveProjects] = useState<EnrichedProject[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.__PRERENDER__) return;
    let cancelled = false;

    fetchJson<ProjectsResponse>("/api/projects")
      .then((data) => {
        if (!cancelled) setLiveProjects(data.projects);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      projects: liveProjects ?? fallbackProjects(),
      live: Boolean(liveProjects),
      error,
    }),
    [liveProjects, error]
  );
}
