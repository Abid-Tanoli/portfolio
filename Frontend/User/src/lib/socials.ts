import { Mail, MapPin, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import type { Profile } from "@/types";

export function buildSocials(profile: Profile) {
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

export function buildContactRail(profile: Profile) {
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
