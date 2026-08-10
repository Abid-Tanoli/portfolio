import { usePortfolio } from "@/context/PortfolioContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Card } from "@/components/ui/card";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export function SkillsGrid({ limit }: { limit?: number }) {
  const groups = limit ? skillGroups.slice(0, limit) : skillGroups;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Skills"
        title="A stack that ships end-to-end"
        description="Five groups, one full pipeline — from pixel-perfect React interfaces to MongoDB schemas and AI-augmented workflows."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, gi) => (
          <ScrollReveal key={group.id} delay={gi * 0.08}>
            <SkillGroupCard group={group} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function SkillGroupCard({ group }: { group: (typeof skillGroups)[number] }) {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <Card ref={ref} className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h3 className="font-display text-lg font-semibold">{group.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {group.skills.map((skill, si) => (
          <span
            key={skill}
            suppressHydrationWarning
            className={cn(
              "reveal inline-flex items-center rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-mono text-xs text-foreground",
              inView && "reveal-in"
            )}
            style={{ transitionDelay: `${si * 0.04}s` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
}
