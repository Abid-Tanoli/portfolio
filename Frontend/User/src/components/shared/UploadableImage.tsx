import { useState } from "react";
import { cn } from "@/lib/utils";

export type ImageSlot = "profile" | "project" | "cert";

export interface UploadableImageProps {
  slot: ImageSlot;
  id: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

const SLOT_PATHS: Record<ImageSlot, string> = {
  profile: "/content/images/profile.jpg",
  project: "/content/images/projects",
  cert: "/content/images/certs",
};

const MONOGRAM = "AT";

export function UploadableImage({
  slot,
  id,
  alt,
  className,
  fallbackLabel,
  priority,
}: UploadableImageProps) {
  const src = slot === "profile" ? SLOT_PATHS.profile : `${SLOT_PATHS[slot]}/${id}`;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showFallback = !loaded || failed;

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      {!failed && (
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
      )}
      {showFallback && (
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/60">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gradient-from to-gradient-to font-display text-2xl font-bold text-white"
        >
          {slot === "profile" ? MONOGRAM : slot === "project" ? id.toUpperCase().slice(0, 2) : "PDF"}
        </span>
        <span className="max-w-[220px] px-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {fallbackLabel ??
            (slot === "profile"
              ? "Drop profile.jpg into content/images"
              : "Screenshot coming soon")}
        </span>
      </div>
      )}
    </div>
  );
}
