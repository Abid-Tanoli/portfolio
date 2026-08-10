import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Cursor } from "@/components/shared/Cursor";
import { TooltipProvider } from "@/components/ui/tooltip";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <TooltipProvider delayDuration={200}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <Cursor />
      <main id="main-content" className="min-h-[calc(100vh-4rem)] pt-16">
        <Outlet />
      </main>
      <Footer />
    </TooltipProvider>
  );
}
