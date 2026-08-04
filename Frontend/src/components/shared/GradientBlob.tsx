import { cn } from "@/lib/utils";

export function GradientBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      suppressHydrationWarning
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--gradient-from) 45%, transparent) 0%, color-mix(in srgb, var(--gradient-from) 18%, transparent) 34%, transparent 68%)",
      }}
    />
  );
}
