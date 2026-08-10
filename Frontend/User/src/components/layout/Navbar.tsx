import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
              isActive ? "text-foreground" : "text-muted-foreground"
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-nav-bg backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2 font-display text-base font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gradient-from to-gradient-to text-sm font-bold text-white">
            AT
          </span>
          <span className="hidden sm:inline">Abid Ali Tanoli</span>
          <span className="sm:hidden">Abid</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <NavItems />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle className="font-display text-lg font-bold">Menu</SheetTitle>
                <div className="mt-4 flex flex-col gap-1">
                  <NavItems onNavigate={() => setOpen(false)} />
                  <SheetClose asChild>
                    <Button variant="gradient" className="mt-4" asChild>
                      <Link to="/contact" onClick={() => setOpen(false)}>
                        Get In Touch
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
