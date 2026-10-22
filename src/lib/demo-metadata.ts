import type { Metadata } from "next";

/** Demo builds are never indexed. */
export function demoMetadata(title: string, description: string): Metadata {
  return {
    title: { absolute: `${title} (Demo build by ISSolutionAgency)` },
    description,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}
