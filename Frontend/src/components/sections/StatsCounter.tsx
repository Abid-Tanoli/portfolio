import { useEffect, useState } from "react";
import { FolderGit2, Layers, BriefcaseBusiness, Award, FolderGit2 as ReposIcon } from "lucide-react";
import { certifications } from "@/data/profile";
import { useEnrichedProjects } from "@/hooks/useEnrichedProjects";
import { fetchJson } from "@/lib/api";
import type { GithubUserSummary } from "@/types";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCounter() {
  const { projects } = useEnrichedProjects();
  const [repoCount, setRepoCount] = useState<number | null>(() =>
    window.__PRERENDER__ ? 12 : null
  );

  useEffect(() => {
    if (window.__PRERENDER__) return;
    let cancelled = false;
    fetchJson<GithubUserSummary>("/api/github/user")
      .then((u) => {
        if (!cancelled) setRepoCount(u.public_repos);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const techCount = new Set(projects.flatMap((p) => p.stack)).size;
  const years = Math.max(
    1,
    Math.round((Date.now() - new Date("2014-03-01").getTime()) / (365.25 * 24 * 3600 * 1000))
  );

  const stats = [
    { icon: FolderGit2, value: projects.length, suffix: "", label: "Projects Built", live: true },
    { icon: Layers, value: techCount, suffix: "+", label: "Technologies", live: true },
    { icon: BriefcaseBusiness, value: years, suffix: "+", label: "Years Professional", live: true },
    { icon: ReposIcon, value: repoCount ?? 0, suffix: "", label: "GitHub Repositories", live: repoCount !== null },
    { icon: Award, value: certifications.length, suffix: "", label: "Certifications", live: true },
  ];

  return (
    <section id="stats" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.06}>
            <div className="glass-card flex flex-col items-center gap-2 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="font-mono text-3xl font-bold tabular-nums">
                {stat.live ? (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <Skeleton className="mx-auto h-8 w-16" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
