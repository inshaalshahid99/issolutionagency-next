import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/work";

/** Demo builds (/demos/*) are noindex and intentionally left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const pages: MetadataRoute.Sitemap = [
    { url: u("/"), changeFrequency: "monthly", priority: 1 },
    { url: u("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: u("/work"), changeFrequency: "monthly", priority: 0.8 },
    { url: u("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: u("/process"), changeFrequency: "yearly", priority: 0.6 },
    { url: u("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: u("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: u("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...pages,
    ...services.map((s) => ({ url: u(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: u(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
