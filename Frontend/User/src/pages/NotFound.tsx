import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useSeo({
    title: "Page Not Found",
    description: "This page doesn't exist.",
    path: "/404",
  });

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gradient-from to-gradient-to text-white">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="font-display text-4xl font-bold tracking-tight">404 — lost in the outfield</h1>
      <p className="max-w-md text-muted-foreground">
        That page doesn't exist. Even the best scorers miss one occasionally — let's get you back
        on the crease.
      </p>
      <Button variant="gradient" size="lg" asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </main>
  );
}
