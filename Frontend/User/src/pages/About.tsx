import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_IMAGE_PATH } from "@/lib/constants";
import { useSeo } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { StaticImage } from "@/components/shared/StaticImage";
import { Card } from "@/components/ui/card";

export default function About() {
  const { profile, aboutSummary, careerGoals } = usePortfolio();
  useSeo({
    title: "About",
    description:
      "The full story of Abid Ali Tanoli — MERN developer at Bano Qabil, AI-augmented workflows, and a decade of financial analytics discipline.",
    path: "/about",
  });

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="The short version"
          description="Developer by craft. Analyst by instinct. Accountant by training — which means the code ships balanced."
        />
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <ScrollReveal>
            <StaticImage
              src={PROFILE_IMAGE_PATH}
              alt={`Portrait of ${profile.name}`}
              initials="AT"
              fallbackLabel="Photograph coming soon"
              className="mx-auto aspect-[4/5] w-full max-w-sm rounded-2xl border border-card-border shadow-lg lg:max-w-none"
            />
          </ScrollReveal>
          <div className="flex flex-col gap-5">
            {aboutSummary.map((paragraph, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <p className="leading-relaxed text-muted-foreground">{paragraph}</p>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={0.25}>
              <Card className="p-6">
                <h3 className="font-display text-base font-semibold">Where I'm headed</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{careerGoals}</p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Engineering first, finance as a superpower"
          description="Technology roles lead the story; the finance roles are the analytical backbone that makes the engineering sharper."
        />
        <ExperienceTimeline />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Education" title="Formal education" />
        <EducationTimeline />
      </section>
    </>
  );
}
