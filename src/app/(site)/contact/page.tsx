import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { Faq } from "@/components/home/Faq";
import { faqs } from "@/content/home";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Tell us about your web project. We reply within one business day. Free quotes, free website audits.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactSection headingAs="h1" />
      <Faq items={faqs} />
    </>
  );
}
