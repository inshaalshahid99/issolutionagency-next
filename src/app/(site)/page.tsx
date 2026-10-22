import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServicesList } from "@/components/home/ServicesList";
import { Differentiation } from "@/components/home/Differentiation";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { WhyUs } from "@/components/home/WhyUs";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { TechMarquee } from "@/components/home/TechMarquee";
import { Outcomes } from "@/components/home/Outcomes";
import { Testimonials } from "@/components/home/Testimonials";
import { Packages } from "@/components/home/Packages";
import { Faq } from "@/components/home/Faq";
import { ContactSection } from "@/components/contact/ContactSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  ...pageMetadata({ description: site.description, path: "/" }),
  title: { absolute: `${site.name} — ${site.tagline}` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="x-sec x-sec--alt" id="services">
        <div className="x-wrap">
          <SectionHeading eyebrow="Services" title="Everything a web project needs" />
          <ServicesList />
        </div>
      </section>
      <Differentiation />
      <WorkShowcase />
      <WhyUs />
      <ProcessTimeline />
      <TechMarquee />
      <Outcomes />
      <Testimonials />
      <Packages />
      <Faq items={faqs} />
      <ContactSection />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
