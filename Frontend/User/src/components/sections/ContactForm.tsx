import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { buildContactRail } from "@/lib/socials";
import { usePortfolio } from "@/context/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

type ContactValues = z.infer<typeof contactSchema>;

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success" }
  | { status: "error"; message: string };

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function ContactForm() {
  const { profile } = usePortfolio();
  const contactRail = buildContactRail(profile);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    setSubmitState({ status: "sending" });
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setSubmitState({
        status: "error",
        message: "Contact form is not configured yet. Please email me directly instead.",
      });
      return;
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, values, EMAILJS_PUBLIC_KEY);
      setSubmitState({ status: "success" });
      reset();
    } catch {
      setSubmitState({
        status: "error",
        message: "Message could not be sent. Please try again or email me directly.",
      });
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      <ScrollReveal>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card flex flex-col gap-5 rounded-xl p-6 sm:p-8"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
              {errors.name ? (
                <p id="name-error" className="text-xs text-red-500" role="alert">
                  {errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email ? (
                <p id="email-error" className="text-xs text-red-500" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="What's this about?"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              {...register("subject")}
            />
            {errors.subject ? (
              <p id="subject-error" className="text-xs text-red-500" role="alert">
                {errors.subject.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell me about your project or opportunity…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              {...register("message")}
            />
            {errors.message ? (
              <p id="message-error" className="text-xs text-red-500" role="alert">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" variant="gradient" size="lg" disabled={submitState.status === "sending"}>
            {submitState.status === "sending" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitState.status === "sending" ? "Sending…" : "Send Message"}
          </Button>

          {submitState.status === "success" ? (
            <div
              className="flex items-center gap-2 rounded-lg bg-accent/15 px-4 py-3 text-sm text-accent"
              role="status"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Message sent! I'll get back to you as soon as possible.
            </div>
          ) : null}

          {submitState.status === "error" ? (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500" role="alert">
              {submitState.message}
            </div>
          ) : null}
        </form>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="flex h-full flex-col gap-4">
          <h3 className="font-display text-lg font-semibold">Other ways to reach me</h3>
          {contactRail.map((item) => (
            <a
              key={item.label}
              href={item.href ?? undefined}
              className={cn(
                "glass-card flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                !item.href && "pointer-events-none cursor-default"
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">
                  {item.value}
                  {item.pending ? (
                    <span className="ml-2 rounded bg-amber/15 px-1.5 py-0.5 font-mono text-[10px] text-amber">
                      pending URL
                    </span>
                  ) : null}
                </span>
              </span>
            </a>
          ))}
          <p className="mt-auto pt-4 text-center font-mono text-xs text-muted-foreground">
            Usually responds within 24 hours · Karachi (GMT+5)
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
