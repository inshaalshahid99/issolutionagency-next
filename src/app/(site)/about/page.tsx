import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { WhyUs } from "@/components/home/WhyUs";
import { Differentiation } from "@/components/home/Differentiation";
import { TechMarquee } from "@/components/home/TechMarquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "ISSolutionAgency is a web development agency building fast, accessible websites, web apps and online stores, with code you own.",
  path: "/about",
});

const principles = [
  { title: "Honest advice", body: "We recommend the stack, scope and package that fit your goals, even when that means a smaller project." },
  { title: "Senior attention", body: "AI helps us move faster, and a senior developer reviews every line before it ships." },
  { title: "Plain communication", body: "Clear milestones, regular demos and no jargon, so you always know where things stand." },
  { title: "Built to last", body: "Accessible, performant, documented code in your own repository. No lock-in." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A partner, not a vendor"
        lead="ISSolutionAgency is a web development agency. We design and build websites, web apps, online stores and APIs for businesses that want a site that's fast, accessible and easy to grow."
        crumbs={[{ label: "About" }]}
      />
      <section className="x-sec x-sec--alt">
        <div className="x-wrap grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="What we do" title="We build for the web. That's the whole focus." className="x-head" />
          <div className="x-reveal grid gap-5 text-[clamp(16px,1vw+11px,18px)] text-muted">
            <p>We&apos;re a web-only studio on purpose. Instead of stretching across every kind of digital service, we go deep on the things that make a web project succeed: clear scope, careful design, clean code, speed, accessibility and search visibility.</p>
            <p>We&apos;re stack-agnostic. Some projects are best on WordPress or Shopify; others need a custom React or Next.js build. We pick the tool that fits your goals and your team, or work in the platform you already have.</p>
            <p>And when a project was started with an AI app builder and got stuck, we can pick it up, fix what&apos;s broken and get it ready for real users.</p>
          </div>
        </div>
      </section>
      <section className="x-sec">
        <div className="x-wrap">
          <SectionHeading eyebrow="Principles" title="How we like to work" className="x-head x-reveal" />
          <div className="x-grid">
            {principles.map((p, i) => (
              <article key={p.title} className="x-card x-tilt x-reveal" style={{ "--d": i } as React.CSSProperties}>
                <span className="x-grad-text text-[44px] font-semibold" style={{ fontFamily: "var(--x-head)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 mb-2 text-[22px]">{p.title}</h3>
                <p className="text-muted m-0">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <WhyUs id="why-us" />
      <Differentiation />
      <TechMarquee />
      <CtaBand secondary={{ href: "/process", label: "See our process" }} />
    </>
  );
}
