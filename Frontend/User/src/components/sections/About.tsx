import { Link } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadableImage } from "@/components/shared/UploadableImage";

export function About() {
  const { profile, aboutSummary, careerGoals, skillGroups } = usePortfolio();
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="About Me"
        title="Engineer by craft, analyst by instinct"
        description="A MERN developer who treats code like a balance sheet — every line accounted for."
      />

      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <ScrollReveal className="mx-auto w-full max-w-sm lg:max-w-none">
          <UploadableImage
            slot="profile"
            id="about"
            alt={`Portrait of ${profile.name}`}
            className="aspect-[4/5] w-full rounded-2xl border border-card-border shadow-lg"
            fallbackLabel="Drop your photo at content/images/profile.jpg"
          />
        </ScrollReveal>

        <div className="flex flex-col gap-6">
          {aboutSummary.map((paragraph, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <p className="leading-relaxed text-muted-foreground">{paragraph}</p>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={0.2}>
            <div className="glass-card flex flex-col gap-3 rounded-xl p-5">
              <div className="flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 text-primary" />
                Current Focus
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{careerGoals}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-2">
              {skillGroups
                .flatMap((g) => g.skills)
                .slice(0, 8)
                .map((skill) => (
                  <Badge key={skill} variant="muted" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <Button variant="outline" asChild>
              <Link to="/about">
                Read the full story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
