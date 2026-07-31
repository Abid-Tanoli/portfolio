import { useEffect, useState } from "react";

function isFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!isFinePointer() || isReducedMotion()) return;
    setEnabled(true);

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      setDot({ x: e.clientX, y: e.clientY });
      setVisible(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setRing((prev) => ({
          x: prev.x + (e.clientX - prev.x) * 0.18,
          y: prev.y + (e.clientY - prev.y) * 0.18,
        }))
      );
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [role='button'], input, textarea, select")));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <div
        className="fixed h-2 w-2 rounded-full bg-primary"
        style={{ left: dot.x - 4, top: dot.y - 4, transition: "opacity 0.2s" }}
      />
      <div
        className="fixed rounded-full border border-primary/60 transition-[width,height] duration-300"
        style={{
          left: ring.x,
          top: ring.y,
          width: hovering ? 44 : 30,
          height: hovering ? 44 : 30,
          marginLeft: hovering ? -22 : -15,
          marginTop: hovering ? -22 : -15,
        }}
      />
    </div>
  );
}
