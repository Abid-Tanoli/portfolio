import { useSeo } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";

export default function Contact() {
  useSeo({
    title: "Contact",
    description:
      "Get in touch with Abid Ali Tanoli — full stack MERN developer in Karachi, Pakistan. Email visionaryabidi@gmail.com or use the contact form.",
    path: "/contact",
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Let's build something"
        description="Freelance work, collaborations, or just a good engineering conversation — the inbox is open."
      />
      <ContactForm />
    </section>
  );
}
