import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, y = 24, className }: ScrollRevealProps) {
  const { ref, inView } = useReveal();

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      className={cn("reveal", inView && "reveal-in", className)}
      style={
        {
          transitionDelay: `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
