import { Award, Briefcase, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Card } from "@/components/ui/card";

const ICONS: Record<string, typeof Trophy> = {
  trophy: Trophy,
  award: Award,
  briefcase: Briefcase,
  sparkles: Sparkles,
  shield: ShieldCheck,
};

export function AchievementsGrid() {
  return (
    <section id="achievements" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Achievements"
        title="Proof, not promises"
        description="Every item here is a verifiable fact from my work history, repositories, and certifications."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, i) => {
          const Icon = ICONS[item.icon] ?? Trophy;
          return (
            <ScrollReveal key={item.id} delay={i * 0.06}>
              <Card className="flex h-full flex-col gap-3 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-from to-gradient-to text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
