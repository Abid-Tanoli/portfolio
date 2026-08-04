import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { useSeo } from "@/lib/seo";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";

const RESUME_URL = import.meta.env.VITE_RESUME_URL ?? "/resume.pdf";

export default function Resume() {
  useSeo({
    title: "Resume",
    description: `Download the resume of ${profile.name} — Full Stack MERN Developer.`,
    path: "/resume",
  });
  const [pdfError, setPdfError] = useState(false);
  const showPdfFallback = window.__PRERENDER__ || pdfError;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
        <p className="max-w-xl text-muted-foreground">
          ATS-friendly, single-column, one page. Updated with the same content you see on this
          site.
        </p>
        <Button variant="gradient" size="lg" asChild>
          <a href={RESUME_URL} download="Abid-Ali-Tanoli-Resume.pdf">
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
              The PDF preview is skipped during prerendering and appears in the live app. If it is unavailable, it will appear here as soon as the final resume is
              generated. The download button above will work once{" "}
              <span className="font-mono text-xs">content/resume.pdf</span> exists.
            </p>
          </div>
        ) : (
          <iframe
            src={RESUME_URL}
            title={`Resume of ${profile.name}`}
            className="h-[75vh] w-full rounded-xl border border-card-border bg-white shadow-lg"
            onError={() => setPdfError(true)}
          />
        )}
      </ScrollReveal>
    </section>
  );
}

