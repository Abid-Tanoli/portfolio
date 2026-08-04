import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/icons";
import { projects } from "@/data/projects";
import { useSeo } from "@/lib/seo";
import { useEnrichedProjects } from "@/hooks/useEnrichedProjects";
import { ProjectBadges } from "@/components/project/ProjectBadges";
import { TechStackPills } from "@/components/project/TechStackPills";
import { UploadableImage } from "@/components/shared/UploadableImage";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { projects: enriched } = useEnrichedProjects();

  const project = enriched.find((p) => p.slug === slug);

  useSeo({
    title: project ? project.name : "Project",
    description: project?.tagline ?? "Project details",
    path: `/projects/${slug ?? ""}`,
  });

  if (!slug || !projects.some((p) => p.slug === slug)) {
    return <Navigate to="/projects" replace />;
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <ScrollReveal>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/projects">
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
        </Button>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="mt-6 flex flex-col gap-3">
          <ProjectBadges project={project} />
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {project.name}
          </h1>
          <p className="text-lg text-muted-foreground">{project.tagline}</p>
          {project.statusNote ? (
            <p className="rounded-lg border border-border bg-muted/40 px-4 py-2.5 font-mono text-xs text-muted-foreground">
              {`Status note: ${project.statusNote}`}
            </p>
          ) : null}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <UploadableImage
          slot="project"
          id={`${project.slug}.png`}
          alt={`${project.name} — project screenshot placeholder`}
          className="mt-8 aspect-[16/9] w-full rounded-2xl border border-card-border shadow-lg"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <section className="mt-10 flex flex-col gap-6">
          <h2 className="font-display text-xl font-semibold">Overview</h2>
          <p className="leading-relaxed text-muted-foreground">{project.description}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <section className="mt-10 flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Key features</h2>
          <ul className="flex flex-col gap-2.5">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <section className="mt-10 flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Tech stack</h2>
          <TechStackPills stack={project.stack} />
          <div className="mt-2 grid grid-cols-2 gap-4 font-mono text-xs text-muted-foreground sm:grid-cols-4">
            <div className="glass-card rounded-lg p-3">
              <div className="text-sm font-bold text-foreground">{project.stars}</div>
              Stars
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="text-sm font-bold text-foreground">{project.forks}</div>
              Forks
            </div>
            {project.language ? (
              <div className="glass-card rounded-lg p-3">
                <div className="text-sm font-bold text-foreground">{project.language}</div>
                Language
              </div>
            ) : null}
            {project.pushedAt ? (
              <div className="glass-card rounded-lg p-3">
                <div className="text-sm font-bold text-foreground">{formatDate(project.pushedAt)}</div>
                Last push
              </div>
            ) : (
              <div className="glass-card rounded-lg p-3">
                <div className="text-sm font-bold text-foreground">{formatDate(project.startedAt)}</div>
                Started
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <section className="mt-10 flex flex-wrap items-center gap-3">
          <Button variant="gradient" asChild>
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              <GitHubIcon className="h-4 w-4" />
              View Source Code
            </a>
          </Button>
          {project.links.map((link) => (
            <Button key={link.label} variant="secondary" asChild>
              <a href={link.url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                {link.label}
              </a>
            </Button>
          ))}
        </section>
      </ScrollReveal>
    </article>
  );
}
