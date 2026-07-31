import { cn } from "@/lib/utils";

export function GradientBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl will-change-transform",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--gradient-from) 45%, transparent), transparent 70%)",
      }}
    />
  );
}
