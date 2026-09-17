import { Link } from "react-router-dom";
import { ExternalLink, GitFork, Star } from "lucide-react";
import type { EnrichedProject } from "@/types/project";
import { ProjectBadges } from "@/components/project/ProjectBadges";
import { TechStackPills } from "@/components/project/TechStackPills";
import { StaticImage } from "@/components/shared/StaticImage";
import { timeAgo } from "@/lib/utils";

export function ProjectCard({ project }: { project: EnrichedProject }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group glass-card flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-ring"
    >
      <StaticImage
        src={project.screenshotUrls?.[0]}
        alt={`${project.name} — project screenshot`}
        initials={project.name.slice(0, 2).toUpperCase()}
        fallbackLabel="Screenshot coming soon"
        className="aspect-[16/9] w-full border-b border-card-border"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-primary">
            {project.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1" title="Stars">
              <Star className="h-3 w-3" />
              {project.stars}
            </span>
            <span className="inline-flex items-center gap-1" title="Forks">
              <GitFork className="h-3 w-3" />
              {project.forks}
            </span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>

        <ProjectBadges project={project} />

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <TechStackPills stack={project.stack} />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Details
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
            {project.pushedAt ? (
              <span className="font-mono text-[11px] text-muted-foreground">
                {timeAgo(project.pushedAt)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
