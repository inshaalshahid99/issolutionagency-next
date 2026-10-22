import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { Prose } from "@/components/pages/Prose";
import { legalUpdated, terms } from "@/content/legal";
import { formatDate } from "@/content/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Terms", description: "Terms of use for the ISSolutionAgency website.", path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" lead={`Last updated ${formatDate(legalUpdated)}.`} crumbs={[{ label: "Terms" }]} />
      <section className="x-sec" style={{ paddingTop: 0 }}>
        <div className="x-wrap" style={{ maxWidth: 760 }}>
          <Prose blocks={terms} />
        </div>
      </section>
    </>
  );
}
