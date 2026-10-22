import type { Viewport } from "next";
import Script from "next/script";
import "./demo.css";
import { DemoBar } from "@/components/demos/DemoBar";
import { markup } from "@/content/demos/ember-and-bean";
import { demoMetadata } from "@/lib/demo-metadata";

export const metadata = demoMetadata("Ember & Bean · Specialty Café", "A demo café website concept built by ISSolutionAgency.");
export const viewport: Viewport = { themeColor: "#fbf8f3", colorScheme: "light" };

/**
 * Demo build, ported verbatim from the approved preview: static markup plus the
 * original behaviour script (public/demos/ember-and-bean.js).
 */
export default function DemoPage() {
  return (
    <>
      <DemoBar concept="WordPress theme concept" caseStudy="/work/ember-and-bean" />
      <div className="iss-demo" dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/demos/ember-and-bean.js" strategy="afterInteractive" />
    </>
  );
}
