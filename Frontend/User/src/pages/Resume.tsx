import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { fetchJson } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";

const FALLBACK_RESUME_URL = import.meta.env.VITE_RESUME_URL ?? "";

interface ApiProfile {
  resumeUrl?: string;
  name?: string;
  [key: string]: unknown;
}

export default function Resume() {
  const [resumeUrl, setResumeUrl] = useState(FALLBACK_RESUME_URL);
  const [name, setName] = useState("Abid Ali Tanoli");
  const [loaded, setLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  useSeo({
    title: "Resume",
    description: `Download the resume of ${name} — Full Stack MERN Developer.`,
    path: "/resume",
  });
  const showPdfFallback = window.__PRERENDER__ || pdfError || !resumeUrl;

  useEffect(() => {
    if (window.__PRERENDER__) return;
    let cancelled = false;
    fetchJson<ApiProfile>("/api/profile", 0)
      .then((data) => {
        if (cancelled) return;
        if (typeof data?.resumeUrl === "string" && data.resumeUrl) {
          setResumeUrl(data.resumeUrl);
        }
        if (typeof data?.name === "string" && data.name) {
          setName(data.name);
        }
      })
      .catch(() => {
        /* backend unreachable — keep local fallback */
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
        <p className="max-w-xl text-muted-foreground">
          ATS-friendly, single-column, one page. Updated with the same content you see on this
          site.
        </p>
        <Button variant="gradient" size="lg" asChild>
          <a href={resumeUrl} download="Abid-Ali-Tanoli-Resume.pdf">
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      <ScrollReveal>
        {showPdfFallback ? (
          <div className="glass-card flex flex-col items-center gap-4 rounded-xl p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">
              The PDF preview is skipped during prerendering and appears in the live app. If it is
              unavailable, it will appear here as soon as the final resume is generated. The
              download button above will work once the resume is published from the Admin panel.
            </p>
          </div>
        ) : !loaded ? (
          <div className="flex h-[75vh] w-full items-center justify-center rounded-xl border border-card-border bg-white">
            <FileText className="h-10 w-10 animate-pulse text-muted-foreground" />
          </div>
        ) : (
          <iframe
            src={resumeUrl}
            title={`Resume of ${name}`}
            className="h-[75vh] w-full rounded-xl border border-card-border bg-white shadow-lg"
            onError={() => setPdfError(true)}
          />
        )}
      </ScrollReveal>
    </section>
  );
}