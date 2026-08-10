import { GraduationCap } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function EducationTimeline() {
  const { education } = usePortfolio();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-6">
        {education.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 0.08}>
            <div className="relative flex gap-6">
              <div
                aria-hidden="true"
                className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground"
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="glass-card flex-1 rounded-xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold">{item.degree}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{item.period}</span>
                </div>
                <p className="mt-0.5 text-sm text-primary">{item.institution}</p>
                {item.note ? (
                  <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
