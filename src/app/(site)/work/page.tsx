import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { WorkGrid } from "@/components/pages/WorkGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Demo builds by ISSolutionAgency: a café website, a skincare store and a React analytics dashboard. Live demos and case studies.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Selected work"
        lead="These are demo builds we designed and developed to show what we do, each with a live demo you can click through. Client case studies will be added as projects launch."
        crumbs={[{ label: "Work" }]}
      />
      <section className="x-sec" style={{ paddingTop: 0 }}>
        <div className="x-wrap">
          <WorkGrid />
        </div>
      </section>
      <CtaBand title="Want something like this?" secondary={{ href: "/services", label: "Explore services" }} />
    </>
  );
}
