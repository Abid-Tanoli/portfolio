import { useSeo } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GithubPanel } from "@/components/sections/GithubPanel";

export default function Github() {
  useSeo({
    title: "GitHub",
    description:
      "Live GitHub stats for Abid-Tanoli — repositories, top languages, and recent activity, sourced from the GitHub API.",
    path: "/github",
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="GitHub"
        title="Code, live and honest"
        description="A static snapshot of my repositories, technologies, and development activity."
      />
      <GithubPanel />
    </section>
  );
}
