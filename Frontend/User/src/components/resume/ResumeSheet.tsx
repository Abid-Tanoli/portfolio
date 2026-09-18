import { Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolio } from "@/context/PortfolioContext";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";
import { useSeo } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FINANCE_SUMMARY =
  "Accountant & Receivable Management professional with 10+ years of experience — supervising receivables, client reconciliations, and collection follow-up at AK Electronics; leading receivables reconciliation across South Pakistan and Oracle ERP reporting at Digicom QMobile; and ensuring data integrity and compliance at Engro Fertilizers. This financial precision is complemented by current, hands-on Full Stack MERN development at the Bano Qabil Incubation Center, where I build BQ-PLAY, a live cricket scoring platform — bringing the same analytical rigor, structured problem-solving, and reporting discipline to engineering.";

const resumeCss = `
.resume-sheet {
  font-family: Calibri, "Segoe UI", Arial, Helvetica, sans-serif;
  color: #1a1a1a;
  background: #ffffff;
  border: 1px solid rgba(15, 17, 21, 0.12);
  border-radius: 4px;
  font-size: 10.5pt;
  line-height: 1.42;
  padding: 36px 44px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.resume-sheet h1,
.resume-sheet h2 {
  font-family: Calibri, "Segoe UI", Arial, Helvetica, sans-serif;
  letter-spacing: normal;
}
.resume-sheet h1 {
  font-size: 21pt;
  margin: 0;
}
.resume-sheet .rs-title {
  font-size: 11pt;
  color: #333;
  margin-top: 2px;
}
.resume-sheet .rs-contact {
  font-size: 9.5pt;
  color: #444;
  margin-top: 6px;
}
.resume-sheet h2 {
  font-size: 11pt;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1.4px solid #1a1a1a;
  padding-bottom: 2px;
  margin: 16px 0 8px;
}
.resume-sheet p {
  margin-bottom: 2px;
}
.resume-sheet .rs-entry {
  margin-bottom: 8px;
}
.resume-sheet .rs-entry-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.resume-sheet .rs-period {
  font-style: italic;
  color: #444;
  white-space: nowrap;
  flex-shrink: 0;
}
.resume-sheet ul {
  padding-left: 18px;
  margin-top: 2px;
}
.resume-sheet li {
  margin-bottom: 1px;
}
.resume-sheet a {
  color: inherit;
  text-decoration: none;
}
.resume-sheet a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.resume-sheet .rs-cross {
  margin-top: 6px;
}

@media print {
  @page {
    size: A4;
    margin: 12mm 14mm;
  }
  body {
    background: #ffffff !important;
  }
  header,
  footer,
  .skip-link,
  .fixed {
    display: none !important;
  }
  main#main-content {
    padding-top: 0 !important;
    min-height: 0 !important;
  }
  .resume-sheet {
    font-size: 9pt;
    line-height: 1.28;
    padding: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: #ffffff !important;
  }
  .resume-sheet h1 {
    font-size: 18pt;
    margin-bottom: 0;
  }
  .resume-sheet .rs-title { font-size: 9.5pt; }
  .resume-sheet .rs-contact { font-size: 8.5pt; }
  .resume-sheet h2 {
    font-size: 9.5pt;
    margin-top: 10px;
    margin-bottom: 4px;
    break-after: avoid;
  }
  .resume-sheet p { margin-bottom: 1px; }
  .resume-sheet .rs-entry {
    margin-bottom: 6px;
    break-inside: avoid;
  }
  .resume-sheet .rs-entry-head {
    break-after: avoid;
  }
  .resume-sheet li,
  .resume-sheet ul,
  .resume-sheet p {
    break-inside: avoid;
  }
  .resume-sheet p,
  .resume-sheet li {
    orphans: 3;
    widows: 3;
  }
  .resume-sheet a {
    color: inherit;
    text-decoration: none;
    border-bottom: none;
  }
}
`;

type Track = "tech" | "finance";

const TRACKS: Record<
  Track,
  {
    path: string;
    label: string;
    sheetTitle: string;
    seoTitle: string;
    seoDescription: (name: string) => string;
    seoPath: string;
  }
> = {
  tech: {
    path: "/resume",
    label: "Developer Resume",
    sheetTitle: "Full Stack Web Developer (MERN) | AI-Augmented Development",
    seoTitle: "Resume",
    seoDescription: (name) =>
      `ATS-friendly resume of ${name} — Full Stack Web Developer (MERN) with AI-augmented development and complementary financial analytics expertise.`,
    seoPath: "/resume",
  },
  finance: {
    path: "/resume/finance",
    label: "Finance Resume",
    sheetTitle: "Accountant & Receivable Management",
    seoTitle: "Resume — Finance",
    seoDescription: (name) =>
      `ATS-friendly resume of ${name} — Accountant & Receivable Management professional with 10+ years of accounting experience and complementary Full Stack MERN development expertise.`,
    seoPath: "/resume/finance",
  },
};

export default function ResumeSheet({ track }: { track: Track }) {
  const { profile, experience, education, skillGroups, certifications } = usePortfolio();
  const meta = TRACKS[track];
  useSeo({
    title: meta.seoTitle,
    description: meta.seoDescription(profile.name),
    path: meta.seoPath,
  });

  const featuredProjects = projects.filter((p) => p.isFeatured);
  const certificationList = certifications.filter(
    (cert) =>
      !education.some((entry) => entry.degree.toLowerCase() === cert.title.toLowerCase())
  );
  const trackExperience = experience.filter((entry) => entry.kind === track);
  const sheetTitle =
    track === "tech" ? `${profile.title.trim()} | AI-Augmented Development` : meta.sheetTitle;
  const summary = track === "tech" ? profile.resumeSummary : FINANCE_SUMMARY;

  return (
    <>
      <style>{resumeCss}</style>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 print:max-w-none print:px-0 print:py-0">
        <div className="mb-8 flex flex-col items-center gap-4 text-center print:hidden">
          <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-card/60 p-1">
            {(["tech", "finance"] as const).map((t) => (
              <Link
                key={t}
                to={TRACKS[t].path}
                aria-current={track === t ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                  track === t
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {TRACKS[t].label}
              </Link>
            ))}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
          <p className="max-w-xl text-muted-foreground">
            ATS-friendly, single column, one page — same content as the rest of this site. Print it
            or save it as a PDF.
          </p>
          <Button variant="gradient" size="lg" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
          <p className="mt-2 text-xs text-muted-foreground print:hidden">
            Tip: Ctrl/Cmd+P → choose "Save as PDF" to download a clean copy.
          </p>
        </div>

        <article className="resume-sheet mx-auto max-w-3xl print:max-w-none">
          <h1>{profile.name}</h1>
          <div className="rs-title">{sheetTitle}</div>
          <div className="rs-contact">
            {profile.location} · {profile.phoneDisplay} ·{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a> ·{" "}
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              github.com/{profile.githubUsername}
            </a>{" "}
            ·{" "}
            <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
              Portfolio: {SITE_URL.replace(/^https?:\/\//, "")}
            </a>
          </div>

          <h2>Professional Summary</h2>
          <p>{summary}</p>

          <h2>Skills</h2>
          {skillGroups.map((group) => (
            <p className="rs-skill" key={group.id}>
              <strong>{group.title}:</strong> {group.skills.join(", ")}
            </p>
          ))}
          <p className="rs-skill rs-cross">
            {track === "tech" ? (
              <>
                <strong>Complementary Background:</strong> 10+ years in Accounting &amp; Receivable
                Management (AK Electronics, Digicom QMobile, Engro Fertilizers) — full details on
                the <Link to="/resume/finance">Finance Resume</Link> →
              </>
            ) : (
              <>
                <strong>Complementary Background:</strong> Full Stack MERN Development — building
                BQ-PLAY, a live cricket scoring platform, at Bano Qabil Incubation Center — full
                details on the <Link to="/resume">Developer Resume</Link> →
              </>
            )}
          </p>

          <h2>Experience</h2>
          {trackExperience.map((entry) => (
            <div className="rs-entry" key={entry.id}>
              <div className="rs-entry-head">
                <span>
                  <strong>{entry.role}</strong> — <strong>{entry.organization}</strong>
                </span>
                <span className="rs-period">{entry.period}</span>
              </div>
              <ul>
                {entry.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}

          <h2>Projects</h2>
          {featuredProjects.map((project) => (
            <div className="rs-entry" key={project.id}>
              <div className="rs-entry-head">
                <span>
                  <strong>{project.name}</strong> — {project.tagline}
                </span>
                <span className="rs-period">{project.repoUrl.replace(/^https?:\/\//, "")}</span>
              </div>
              <ul>
                {project.features.slice(0, 2).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}

          <h2>Education</h2>
          {education.map((entry) => (
            <div className="rs-entry" key={entry.id}>
              <div className="rs-entry-head">
                <span>
                  <strong>{entry.degree}</strong>
                  {entry.institution ? ` — ${entry.institution}` : entry.period ? ` — ${entry.period}` : ""}
                </span>
              </div>
            </div>
          ))}

          <h2>Certifications</h2>
          <ul>
            {certificationList.map((cert) => (
              <li key={cert.id}>
                {cert.title} — {cert.issuer}
                {cert.batch ? ` (${cert.batch})` : ""}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}