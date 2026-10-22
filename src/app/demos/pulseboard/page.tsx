import type { Viewport } from "next";
import "./demo.css";
import { DemoBar } from "@/components/demos/DemoBar";
import { PulseboardApp } from "@/components/demos/PulseboardApp";
import { demoMetadata } from "@/lib/demo-metadata";

export const metadata = demoMetadata("Pulseboard · Live product analytics", "A demo React product-analytics site and dashboard built by ISSolutionAgency. All data is generated.");
export const viewport: Viewport = { themeColor: "#F7F8FC", colorScheme: "light" };

export default function PulseboardDemoPage() {
  return (
    <div id="root">
      <DemoBar concept="React app concept" caseStudy="/work/pulseboard" />
      <PulseboardApp />
    </div>
  );
}
