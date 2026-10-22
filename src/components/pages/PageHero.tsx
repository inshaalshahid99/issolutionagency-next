import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";

export type Crumb = { label: string; href?: string };

/** Inner-page hero with breadcrumbs (+ BreadcrumbList JSON-LD). */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  return (
    <section className="x-phero">
      <div className="x-blob x-blob--a" style={{ top: -200, left: -200, opacity: 0.22 }} />
      <div className="x-blob x-blob--b" style={{ top: 40, right: -160, bottom: "auto", opacity: 0.12 }} />
      <div className="x-wrap">
        <nav aria-label="Breadcrumb">
          <ol className="x-crumbs">
            {all.map((c, i) => (
              <li key={i}>
                {c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="x-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="x-lead">{lead}</p>}
        {children}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${site.url}${c.href === "/" ? "" : c.href}` } : {}),
          })),
        }}
      />
    </section>
  );
}
