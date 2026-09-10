import { useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { useSeo } from "@/lib/seo";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";

export default function Resume() {
  const resumeUrl = profile.resumeUrl;
  const name = profile.name;
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useSeo({
    title: "Resume",
    description: `Download the resume of ${name} — Full Stack MERN Developer.`,
    path: "/resume",
  });

  // Show the static fallback card when:
  // - we're in prerender mode (no browser APIs)
  // - there is no resume URL yet
  // - the iframe failed to load the PDF
  const showPdfFallback = window.__PRERENDER__ || iframeError || !resumeUrl;

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
          /* Static fallback: shown during prerender, before PDF is generated, or on iframe error */
          <div className="glass-card flex flex-col items-center gap-4 rounded-xl p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">
              {resumeUrl
                ? "PDF preview is temporarily unavailable. Use the Download button above to get the latest version."
                : "The PDF preview will appear here once the resume is generated from the Admin panel. Use the Download button above once ready."}
            </p>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Open PDF in new tab
              </a>
            )}
          </div>
        ) : (
          /*
           * Live PDF embed — renders the exact same Cloudinary-hosted PDF that the
           * admin generates, so the preview and the download are always identical.
           * onError falls back to the static card above if the browser blocks the iframe.
           */
          <iframe
            ref={iframeRef}
            src={resumeUrl}
            title={name ? `Resume of ${name}` : "Resume"}
            className="h-[80vh] w-full rounded-xl border border-slate-200 shadow-lg"
            onError={() => setIframeError(true)}
          />
        )}
      </ScrollReveal>
    </section>
  );
}