import { useSeo } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CertificationsGrid } from "@/components/sections/CertificationsGrid";

export default function Certifications() {
  useSeo({
    title: "Certifications",
    description:
      "Certifications by Abid Ali Tanoli — Bano Qabil backend development, React.js, and web development; Computerized Accounting (A+).",
    path: "/certifications",
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Certifications"
        title="Credentials that back the craft"
        description="Certificate scans can be dropped into content/images/certs — cards update automatically."
      />
      <CertificationsGrid />
    </section>
  );
}
