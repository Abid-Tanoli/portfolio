import { Link } from "react-router-dom";
import { navLinks, socials } from "@/lib/constants";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6">
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {socials.map((social) =>
            social.href ? (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ) : (
              <span
                key={social.label}
                title="Coming soon"
                className="flex h-11 w-11 cursor-default items-center justify-center rounded-lg border border-border text-muted-foreground/60"
              >
                <social.icon className="h-4 w-4" />
              </span>
            )
          )}
        </div>

        <p className="text-center font-mono text-xs text-muted-foreground">
          {`© ${new Date().getFullYear()} ${profile.name} · ${profile.location} · Built with React & Express`}
        </p>
      </div>
    </footer>
  );
}
