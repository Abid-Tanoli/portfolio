import { useSeo } from "@/lib/seo";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

export default function Projects() {
  useSeo({
    title: "Projects",
    description:
      "Full-stack MERN projects by Abid Ali Tanoli — BQ-PLAY live cricket scoring, LowPriceMart e-commerce, event booking platforms, and more, with live GitHub data.",
    path: "/projects",
  });

  return <ProjectsGrid />;
}
