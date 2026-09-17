import { useState } from "react";
import { cn } from "@/lib/utils";

export interface StaticImageProps {
  src?: string;
  alt: string;
  className?: string;
  initials?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

export function StaticImage({
  src,
  alt,
  className,
  initials,
  fallbackLabel = "Image coming soon",
  priority,
}: StaticImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showFallback = !src || !loaded || failed;

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          width={800}
          height={450}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {showFallback ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/60">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gradient-from to-gradient-to font-display text-2xl font-bold text-white"
          >
            {initials ?? "AT"}
          </span>
          <span className="max-w-[220px] px-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fallbackLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}