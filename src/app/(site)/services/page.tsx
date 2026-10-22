import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { ServicesList } from "@/components/home/ServicesList";
import { Packages } from "@/components/home/Packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceGlyph } from "@/components/ui/Icons";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: "Custom websites, web apps, front-end, back-end and APIs, e-commerce, WordPress, performance and SEO, maintenance, AI chatbots and AI-app rescue.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a web project needs"
        lead="From a single landing page to a full web application, we plan, design, build and look after it. Pick a service to see what's included."
        crumbs={[{ label: "Services" }]}
      />
      <section className="x-sec x-sec--alt" style={{ paddingTop: "clamp(48px, 6vw, 80px)" }}>
        <div className="x-wrap">
          <ServicesList headingLevel="h2" />
        </div>
      </section>
      <section className="x-sec">
        <div className="x-wrap">
          <SectionHeading eyebrow="At a glance" title="Find the right starting point" className="x-head x-reveal" />
          <div className="x-grid">
            {services.map((s, i) => (
              <article key={s.slug} className="x-card x-tilt x-reveal" style={{ "--d": i % 3 } as React.CSSProperties}>
                <div className="x-icon">
                  <ServiceGlyph name={s.icon} />
                </div>
                <h2 className="mt-5 mb-2 text-[22px]">{s.title}</h2>
                <p className="text-muted m-0">{s.short}</p>
                <Link className="x-more" href={`/services/${s.slug}`}>
                  Learn more<span className="sr-only"> about {s.title}</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Packages contactHref="/contact" />
      <CtaBand secondary={{ href: "/work", label: "See our work" }} />
    </>
  );
}
