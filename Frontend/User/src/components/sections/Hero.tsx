import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, MessageCircle, MapPin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientBlob } from "@/components/shared/GradientBlob";
import { UploadableImage } from "@/components/shared/UploadableImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(() => words[0]);
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || window.__PRERENDER__) {
      setText(words[0]);
      return;
    }
    const t = setTimeout(() => setStarted(true), 900);
    return () => clearTimeout(t);
  }, [reduced, words]);

  useEffect(() => {
    if (reduced || !started) return;
    const word = words[index % words.length];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (text.length < word.length) {
            setText(word.slice(0, text.length + 1));
          } else {
            setDeleting(true);
          }
        } else {
          if (text.length > 0) {
            setText(word.slice(0, text.length - 1));
          } else {
            setDeleting(false);
            setIndex((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? 35 : 70
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, reduced, started]);

  return text;
}

export function Hero() {
  const { profile, heroSublines, heroSummary } = usePortfolio();
  const reduced = usePrefersReducedMotion();
  const typed = useTypewriter(heroSublines);
  const meshRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 600);
        if (meshRef.current) meshRef.current.style.transform = `translateY(${y * 0.23}px)`;
        if (contentRef.current) contentRef.current.style.transform = `translateY(${y * -0.06}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const rise = (delay: number) => ({ animationDelay: `${delay}s` });

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      <GradientBlob className="-left-40 -top-40 h-[34rem] w-[34rem]" />
      <GradientBlob className="right-[-12rem] top-1/3 h-[30rem] w-[30rem] opacity-70" />
        <div
          ref={meshRef}
          aria-hidden="true"
          suppressHydrationWarning
          className="pointer-events-none absolute inset-0 will-change-transform"
        >
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-20"
          suppressHydrationWarning
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
      >
        <div className="flex flex-col gap-6">
          <div className="hero-rise flex flex-wrap items-center gap-2" suppressHydrationWarning style={rise(0)}>
            <Badge variant="accent" className="gap-1.5 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Open to opportunities
            </Badge>
            <Badge variant="muted" className="gap-1">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </Badge>
          </div>

          <h1 className="hero-rise font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl" suppressHydrationWarning style={rise(0)}>
            {profile.name.split(" ")[0] + " "}
            <span className="text-gradient">{profile.name.split(" ").slice(1).join(" ")}</span>
            <span className="mt-3 block text-2xl font-semibold text-muted-foreground sm:text-3xl lg:text-4xl">
              Full Stack Web Developer (MERN)
            </span>
          </h1>

          <p className="hero-rise font-mono text-sm text-accent sm:text-base" suppressHydrationWarning style={rise(0.15)} aria-live="polite">
            <span className="text-muted-foreground">$</span> <span suppressHydrationWarning>{typed}</span>
            <span className="animate-pulse">▍</span>
          </p>

          <p className="hero-rise max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg" suppressHydrationWarning style={rise(0.25)}>
            {heroSummary}
          </p>

          <div className="hero-rise flex flex-wrap items-center gap-3" suppressHydrationWarning style={rise(0.2)}>
            <Button variant="gradient" size="lg" asChild>
              <Link to="/projects">
                View Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="/resume.pdf" download="Abid-Ali-Tanoli-Resume.pdf">
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link to="/contact">
                <MessageCircle className="h-4 w-4" />
                Get In Touch
              </Link>
            </Button>
          </div>
        </div>

        <div className="hero-zoom mx-auto w-full max-w-xs lg:max-w-sm" suppressHydrationWarning style={rise(0)}>
          <UploadableImage
            slot="profile"
            id="profile"
            alt={`Portrait of ${profile.name}`}
            priority
            className="aspect-square w-full rounded-2xl border border-card-border shadow-2xl"
            fallbackLabel="Drop your photo at content/images/profile.jpg"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow"
      >
        <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/40" />
      </div>
    </section>
  );
}

