import { useMemo, useState } from "react";
import { categoryLabels, projects as curated } from "@/data/projects";
import { useEnrichedProjects } from "@/hooks/useEnrichedProjects";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["all", "flagship", "full-stack", "coursework"] as const;
type Category = (typeof CATEGORIES)[number];

export function ProjectsGrid({ featuredOnly }: { featuredOnly?: boolean }) {
  const { projects, error } = useEnrichedProjects();
  const [category, setCategory] = useState<Category>("all");
  const headingAs = featuredOnly ? "h2" : "h1";

  const visible = useMemo(() => {
    let list = projects;
    if (featuredOnly) list = list.filter((p) => p.isFeatured);
    if (category !== "all") list = list.filter((p) => p.category === category);
    return [...list].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [projects, category, featuredOnly]);

  const tabs = (
    <TabsList className="mb-10">
      {CATEGORIES.map((c) => (
        <TabsTrigger key={c} value={c} onClick={() => setCategory(c)}>
          {c === "all" ? "All" : categoryLabels[c]}
          <span className="ml-1 font-mono text-[10px] text-muted-foreground">
            {c === "all"
              ? curated.length
              : curated.filter((p) => p.category === c).length}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        as={headingAs}
        eyebrow="Projects"
        title="Work that ships"
        description={
          featuredOnly
            ? "The work I'm proudest of — every one built end-to-end."
            : "Curated from my GitHub, enriched with live repository data. Filter by category."
        }
      />

      {!featuredOnly && (
        <Tabs value={category} onValueChange={(v) => setCategory(v as Category)} className="flex flex-col items-center">
          {tabs}
        </Tabs>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <ScrollReveal key={project.slug} delay={Math.min(i * 0.06, 0.4)}>
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>

      {error ? (
        <p className="mt-8 text-center font-mono text-xs text-muted-foreground">
          Live GitHub stats unavailable right now — showing curated project data.
        </p>
      ) : null}
    </section>
  );
}
