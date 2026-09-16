import { Printer } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { projects } from "@/data/projects";
import { useSeo } from "@/lib/seo";
import { Button } from "@/components/ui/button";

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
  }
}
`;

export default function Resume() {
  const { profile, experience, education, skillGroups, certifications } = usePortfolio();
  useSeo({
    title: "Resume",
    description: `ATS-friendly resume of ${profile.name} — Full Stack Web Developer (MERN) with AI-augmented development and financial analytics expertise.`,
    path: "/resume",
  });

  const featuredProjects = projects.filter((p) => p.isFeatured);
  const certificationList = certifications.filter(
    (cert) =>
      !education.some((entry) => entry.degree.toLowerCase() === cert.title.toLowerCase())
  );

  return (
    <>
      <style>{resumeCss}</style>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 print:max-w-none print:px-0 print:py-0">
        <div className="mb-8 flex flex-col items-center gap-4 text-center print:hidden">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
          <p className="max-w-xl text-muted-foreground">
            ATS-friendly, single column, one page — same content as the rest of this site. Print it
            or save it as a PDF.
          </p>
          <Button variant="gradient" size="lg" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>

        <article className="resume-sheet mx-auto max-w-3xl print:max-w-none">
          <h1>{profile.name}</h1>
          <div className="rs-title">
            {profile.title.trim()} | AI-Augmented Development | Accountant &amp; Receivable
            Management
          </div>
          <div className="rs-contact">
            {profile.location} · {profile.phoneDisplay} · {profile.email} ·
            github.com/{profile.githubUsername}
          </div>

          <h2>Professional Summary</h2>
          <p>{profile.resumeSummary}</p>

          <h2>Skills</h2>
          {skillGroups.map((group) => (
            <p className="rs-skill" key={group.id}>
              <strong>{group.title}:</strong> {group.skills.join(", ")}
            </p>
          ))}

          <h2>Experience</h2>
          {experience.map((entry) => (
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
                  <strong>{entry.degree}</strong> — {entry.institution}
                </span>
                <span className="rs-period">{entry.period}</span>
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