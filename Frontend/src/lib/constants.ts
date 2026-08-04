import { Mail, MapPin, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import { profile } from "@/data/profile";

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Certifications", to: "/certifications" },
  { label: "Resume", to: "/resume" },
  { label: "GitHub", to: "/github" },
  { label: "Contact", to: "/contact" },
];

export const socials = [
  { label: "GitHub", href: profile.github, icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    pending: profile.linkedinPending,
    icon: LinkedInIcon,
  },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export const contactRail = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  { label: "Phone", value: profile.phoneDisplay, href: `tel:${profile.phone.replace(/[^+\d]/g, "")}`, icon: Phone },
  { label: "Location", value: profile.location, href: undefined, icon: MapPin },
  {
    label: "LinkedIn",
    value: profile.linkedinPending ? "URL coming soon" : profile.linkedin,
    href: profile.linkedin || undefined,
    icon: LinkedInIcon,
    pending: profile.linkedinPending,
  },
];

export const SITE_NAME = "Abid Ali Tanoli";
export const SITE_TITLE = "Abid Ali Tanoli — Full Stack MERN Developer";
export const SITE_DESCRIPTION =
  "Full Stack Web Developer (MERN) with a specialization in AI-augmented development. Building BQ-PLAY live cricket scoring at Bano Qabil. 10+ years of financial analytics rigor behind every line of code.";
