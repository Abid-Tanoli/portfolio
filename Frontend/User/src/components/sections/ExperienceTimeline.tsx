import { Briefcase, Check, Cpu } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ExperienceTimeline() {
  const { experience } = usePortfolio();
  return (
    <div className="relative mx-auto max-w-3xl">
      <div
        aria-hidden="true"
        className="absolute left-[19px] top-2 bottom-2 w-px bg-border sm:left-1/2"
      />
      <div className="flex flex-col gap-10">
        {experience.map((job, i) => (
          <ScrollReveal key={job.id} delay={i * 0.05}>
            <div
              className={cn(
                "relative flex gap-6 sm:w-1/2 sm:pl-0",
                i % 2 === 0
                  ? "sm:mr-auto sm:pr-10 sm:text-right sm:flex-row-reverse"
                  : "sm:ml-auto sm:pl-10"
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border",
                  job.kind === "tech"
                    ? "bg-gradient-to-br from-gradient-from to-gradient-to text-white shadow-md"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {job.kind === "tech" ? <Cpu className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
              </div>

              <div className="glass-card flex-1 rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className={cn("flex flex-col gap-1", i % 2 === 0 ? "sm:items-end" : "")}>
                  <span className="font-mono text-xs text-muted-foreground">{job.period}</span>
                  <h3 className="font-display text-base font-semibold">{job.role}</h3>
                  <p className="text-sm text-primary">{job.organization}</p>
                  <Badge
                    variant={job.kind === "tech" ? "accent" : "muted"}
                    className="mt-1 w-fit"
                  >
                    {job.kind === "tech" ? "Engineering" : "Finance & Analytics"}
                  </Badge>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {job.summary}
                  </p>
                  <ul
                    className={cn(
                      "mt-3 flex flex-col gap-1.5",
                      i % 2 === 0 && "sm:items-end"
                    )}
                  >
                    {job.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex max-w-full gap-2 text-left text-sm text-foreground/90"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
