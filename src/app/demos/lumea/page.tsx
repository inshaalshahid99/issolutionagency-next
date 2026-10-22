import type { Viewport } from "next";
import Script from "next/script";
import "./demo.css";
import { DemoBar } from "@/components/demos/DemoBar";
import { markup } from "@/content/demos/lumea";
import { demoMetadata } from "@/lib/demo-metadata";

export const metadata = demoMetadata("Lumea · Skin, simplified", "A demo skincare store concept built by ISSolutionAgency.");
export const viewport: Viewport = { themeColor: "#faf7f2", colorScheme: "light" };

/**
 * Demo build, ported verbatim from the approved preview: static markup plus the
 * original behaviour script (public/demos/lumea.js).
 */
export default function DemoPage() {
  return (
    <>
      <DemoBar concept="Shopify theme concept" caseStudy="/work/lumea" />
      <div className="iss-demo" dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/demos/lumea.js" strategy="afterInteractive" />
    </>
  );
}
