import { usePortfolio } from "@/context/PortfolioContext";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { StaticImage } from "@/components/shared/StaticImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CertificationsGrid() {
  const { certifications } = usePortfolio();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert, i) => (
        <ScrollReveal key={cert.id} delay={i * 0.06}>
          <Card className="flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <StaticImage
              src={cert.imageUrl}
              alt={`${cert.title} — certificate`}
              initials="PDF"
              fallbackLabel="Scan coming soon"
              className="aspect-[16/10] w-full border-b border-card-border"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-base leading-snug">{cert.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2">
              <p className="text-sm text-primary">{cert.issuer}</p>
              {cert.batch ? (
                <Badge variant="muted" className="w-fit">
                  {cert.batch}
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
}
