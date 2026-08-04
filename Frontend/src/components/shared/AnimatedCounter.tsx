import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useTheme";

export function AnimatedCounter({
  value,
  duration = 1400,
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${Math.round(eased * value)}${suffix}`;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          raf = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [value, duration, suffix, prefix, reduced]);

  return (
    <span ref={ref} suppressHydrationWarning aria-label={`${prefix}${value}${suffix}`}>
      {reduced ? `${prefix}${value}${suffix}` : `${prefix}0${suffix}`}
    </span>
  );
}
