import type { EnrichedProject } from "@/types/project";
import { statusLabels } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "accent" | "amber" | "muted" | "default"> = {
  live: "accent",
  "in-progress": "amber",
  archived: "muted",
  verify: "default",
};

export function ProjectBadges({ project }: { project: EnrichedProject }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={STATUS_VARIANT[project.status]} className="gap-1.5">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            project.status === "live" && "bg-accent",
            project.status === "in-progress" && "bg-amber",
            project.status === "archived" && "bg-muted-foreground",
            project.status === "verify" && "bg-primary"
          )}
        />
        {statusLabels[project.status]}
      </Badge>
      {project.category !== "coursework" && (
        <Badge variant="outline">{project.category === "flagship" ? "Flagship" : "Full Stack"}</Badge>
      )}
      {project.language ? <Badge variant="muted">{project.language}</Badge> : null}
    </div>
  );
}
