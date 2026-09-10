import { FolderGit2, Layers, BriefcaseBusiness, Award, FolderGit2 as ReposIcon } from "lucide-react";
import { certifications } from "@/data/certifications";
import { useEnrichedProjects } from "@/hooks/useEnrichedProjects";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function StatsCounter() {
  const { projects } = useEnrichedProjects();
  const repoCount = projects.length;

  const techCount = new Set(projects.flatMap((p) => p.stack)).size;
  const years = Math.max(
    1,
    Math.round((Date.now() - new Date("2014-03-01").getTime()) / (365.25 * 24 * 3600 * 1000))
  );

  const stats = [
    { icon: FolderGit2, value: projects.length, suffix: "", label: "Projects Built", live: true },
    { icon: Layers, value: techCount, suffix: "+", label: "Technologies", live: true },
    { icon: BriefcaseBusiness, value: years, suffix: "+", label: "Years Professional", live: true },
    { icon: ReposIcon, value: repoCount, suffix: "", label: "GitHub Repositories", live: true },
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
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
