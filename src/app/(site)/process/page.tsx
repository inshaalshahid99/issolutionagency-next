import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Faq } from "@/components/home/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps, faqs } from "@/content/home";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Process",
  description: "How we work: Discover, Plan & Architect, Design, Develop, Test & Launch, Support & Grow. Fixed milestones and demos at every step.",
  path: "/process",
});

const outputs = [
  "A shared summary of goals, users, content and constraints",
  "Scope, sitemap, chosen stack and a milestone plan with a fixed price",
  "Wireframes and responsive designs for your sign-off",
  "A working staging site, demoed at every milestone",
  "Cross-browser, performance and accessibility checks, then launch",
  "A care plan or support as you grow, if you want one",
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How we work"
        lead="Six clear steps, fixed milestones and working demos along the way, so there are no surprises on launch day."
        crumbs={[{ label: "Process" }]}
      />
      <ProcessTimeline title="Six steps, start to launch" />
      <section className="x-sec x-sec--alt">
        <div className="x-wrap">
          <SectionHeading eyebrow="What you get" title="Something to show at every step" className="x-head x-reveal" />
          <ol className="x-grid m-0 list-none p-0">
            {processSteps.map((s, i) => (
              <li key={s.title} className="x-card x-reveal" style={{ "--d": i % 3 } as React.CSSProperties}>
                <span className="x-pill">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 mb-2 text-[22px]">{s.title}</h3>
                <p className="text-muted m-0">{outputs[i]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Faq items={faqs.slice(1, 5)} title="Process questions" id="process-faq" alt={false} />
      <CtaBand />
    </>
  );
}
