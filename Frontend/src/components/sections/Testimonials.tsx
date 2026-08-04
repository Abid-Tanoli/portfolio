import { useState } from "react";
import { ChevronDown, MessageSquareQuote } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [open, setOpen] = useState(false);

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <ScrollReveal>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-6 py-5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex items-center gap-3 font-display text-lg font-semibold">
            <MessageSquareQuote className="h-5 w-5 text-primary" />
            Testimonials
          </span>
          <ChevronDown
            className={cn("h-5 w-5 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <MessageSquareQuote className="h-6 w-6" />
            </span>
            <h3 className="font-display text-lg font-semibold">Testimonials coming soon</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              I'm currently gathering feedback from teammates and mentors at Bano Qabil
              Incubation Center. Real quotes will appear here as they arrive.
            </p>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
