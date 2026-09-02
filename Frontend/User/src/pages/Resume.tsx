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

  const resumePreview = (
    <div className="flex h-[75vh] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Resume Preview</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{name}</h2>
        <p className="mt-1 text-sm text-slate-600">Full Stack Web Developer (MERN) · AI-Augmented Development</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 text-sm leading-7 text-slate-700">
        <section className="mb-6">
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Professional Summary</h3>
          <p>
            Full Stack Web Developer with hands-on MERN expertise, a growing specialization in AI-augmented development,
            and a strong foundation in accounting, receivables, and operational analysis.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Tailwind",
              "REST APIs",
              "JWT",
              "GitHub",
              "AI coding workflows",
              "Financial analysis",
            ].map((skill) => (
              <span key={skill} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Experience</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-800">Full Stack Web Development Intern — Bano Qabil Incubation Center</p>
              <p>Building MERN applications, real-time scoring systems, and AI-assisted product workflows.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Accountant / Receivable Management — AK Electronics</p>
              <p>Managing accounting operations, reconciliations, reporting, and client receivable oversight.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Education</h3>
          <p className="font-semibold text-slate-800">B.Com — University of Karachi</p>
          <p>Ongoing academic focus alongside software development and product-building work.</p>
        </section>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs text-slate-600">
        <span>PDF preview may be unavailable in some browsers</span>
        {resumeUrl ? (
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Open PDF
          </a>
        ) : null}
      </div>
    </div>
  );

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
          resumePreview
        )}
      </ScrollReveal>
    </section>
  );
}