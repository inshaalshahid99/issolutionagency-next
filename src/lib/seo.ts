import type { Metadata } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";

/** Per-page metadata helper: title, description, canonical and Open Graph. */
export function pageMetadata({ title, description, path, noindex }: { title?: string; description: string; path: string; noindex?: boolean }): Metadata {
  const url = path === "/" ? "/" : path;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`, description, url, siteName: site.name, type: "website" },
    twitter: { card: "summary_large_image", title: title ? `${title} | ${site.name}` : site.name, description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        email: site.email,
        logo: `${site.url}/icon.svg`,
        description: site.description,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: site.name,
        url: site.url,
        email: site.email,
        image: `${site.url}/opengraph-image`,
        description: site.description,
        parentOrganization: { "@id": `${site.url}/#org` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web development services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.short, url: `${site.url}/services/${s.slug}` },
          })),
        },
      },
      { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, publisher: { "@id": `${site.url}/#org` } },
    ],
  };
}
