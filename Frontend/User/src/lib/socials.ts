import { Mail, MapPin, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import type { PortfolioProfile } from "@/context/PortfolioContext";

export function buildSocials(profile: PortfolioProfile) {
  return [
    { label: "GitHub", href: profile.github, icon: GitHubIcon },
    {
      label: "LinkedIn",
      href: profile.linkedin,
      pending: profile.linkedinPending,
      icon: LinkedInIcon,
    },
    { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
  ];
}

export function buildContactRail(profile: PortfolioProfile) {
  return [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
    },
    {
      label: "Phone",
      value: profile.phoneDisplay,
      href: `tel:${profile.phone.replace(/[^+\d]/g, "")}`,
      icon: Phone,
    },
    { label: "Location", value: profile.location, href: undefined, icon: MapPin },
    {
      label: "LinkedIn",
      value: profile.linkedinPending ? "URL coming soon" : profile.linkedin,
      href: profile.linkedin || undefined,
      icon: LinkedInIcon,
      pending: profile.linkedinPending,
    },
  ];
}
