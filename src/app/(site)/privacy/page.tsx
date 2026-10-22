import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { Prose } from "@/components/pages/Prose";
import { legalUpdated, privacy } from "@/content/legal";
import { formatDate } from "@/content/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy", description: "How ISSolutionAgency collects and uses information submitted through this website.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead={`Last updated ${formatDate(legalUpdated)}.`} crumbs={[{ label: "Privacy Policy" }]} />
      <section className="x-sec" style={{ paddingTop: 0 }}>
        <div className="x-wrap" style={{ maxWidth: 760 }}>
          <Prose blocks={privacy} />
        </div>
      </section>
    </>
  );
}
