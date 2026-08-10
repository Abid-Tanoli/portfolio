import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as = "h2",
}: SectionHeadingProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <Heading className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className={cn("max-w-2xl text-muted-foreground", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
