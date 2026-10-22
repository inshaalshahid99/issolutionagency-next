import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { Faq } from "@/components/home/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckSvg, ServiceGlyph } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, services } from "@/content/services";
import { formatUSD, getPackage } from "@/content/packages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.summary, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const pkg = s.packageId ? getPackage(s.packageId) : undefined;
  const idx = services.findIndex((x) => x.slug === s.slug);
  const related = [services[(idx + 1) % services.length], services[(idx + 2) % services.length], services[(idx + 3) % services.length]];

  return (
    <>
      <PageHero eyebrow="Service" title={s.title} lead={s.summary} crumbs={[{ label: "Services", href: "/services" }, { label: s.title }]}>
        <div className="x-ctas mt-8">
          <Link className="x-btn x-btn--grad x-mag" href={`/contact?service=${s.slug}`}>
            Get a quote
          </Link>
          <Link className="x-btn x-mag" href="/work">
            See our work
          </Link>
        </div>
      </PageHero>

      <section className="x-sec x-sec--alt">
        <div className="x-wrap grid gap-10 lg:grid-cols-2">
          <div className="x-reveal">
            <p className="x-eyebrow">Who it&apos;s for</p>
            <ul className="m-0 list-none p-0 grid gap-4">
              {s.forWho.map((w) => (
                <li key={w} className="flex gap-3 text-[17px]">
                  <span className="x-svc-check" aria-hidden="true">
                    <CheckSvg />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="x-card x-reveal" style={{ "--d": 1 } as React.CSSProperties}>
            <div className="x-icon">
              <ServiceGlyph name={s.icon} />
            </div>
            <h2 className="mt-5 mb-4 text-[clamp(24px,2.4vw,32px)]">What you get</h2>
            <ul className="m-0 grid gap-3 p-0 list-none">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-muted">
                  <span className="x-svc-check" aria-hidden="true">
                    <CheckSvg />
                  </span>
                  <span className="text-fg">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="x-sec">
        <div className="x-wrap">
          <SectionHeading eyebrow="How we approach it" title="Built the right way" className="x-head x-reveal" />
          <div className="x-why2">
            {s.approach.map((a, i) => (
              <article className="x-card x-tilt x-reveal" key={a.title} style={{ "--d": i } as React.CSSProperties}>
                <span className="x-num x-grad-text">{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </article>
            ))}
            {pkg && (
              <article className="x-card x-reveal" style={{ "--d": 3 } as React.CSSProperties}>
                <span className="x-pill">Usually fits</span>
                <h3 className="mt-4">{pkg.name}</h3>
                <p>
                  From <strong className="x-grad-text">{formatUSD(pkg.price)}</strong>
                  {pkg.unitLong ? ` ${pkg.unitLong}` : ""} · {pkg.timeline}. Final price depends on scope.
                </p>
                <Link className="x-more" href={`/contact?package=${pkg.id}`}>
                  Get a quote for {pkg.name}
                </Link>
              </article>
            )}
          </div>
          <div className="mt-12 x-reveal">
            <p className="x-eyebrow">Tools we often use</p>
            <ul className="x-work__tags" aria-label="Tools">
              {s.tools.map((t) => (
                <li className="x-pill" key={t}>
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-muted mt-4 text-[15px]">We&apos;re stack-agnostic: if you already have a platform, we work in it.</p>
          </div>
        </div>
      </section>

      <Faq items={s.faqs} title={`${s.title}: questions`} id="service-faq" />

      <section className="x-sec">
        <div className="x-wrap">
          <SectionHeading eyebrow="Related" title="Other services" className="x-head x-reveal" />
          <div className="x-grid">
            {related.map((r, i) => (
              <article key={r.slug} className="x-card x-tilt x-reveal" style={{ "--d": i } as React.CSSProperties}>
                <div className="x-icon">
                  <ServiceGlyph name={r.icon} />
                </div>
                <h3 className="mt-5 mb-2 text-[22px]">{r.title}</h3>
                <p className="text-muted m-0">{r.short}</p>
                <Link className="x-more" href={`/services/${r.slug}`}>
                  Learn more<span className="sr-only"> about {r.title}</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={`Let's talk ${s.title.toLowerCase()}.`} href={`/contact?service=${s.slug}`} label="Get a quote" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.summary,
          serviceType: s.title,
          url: `${site.url}/services/${s.slug}`,
          provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
          ...(pkg ? { offers: { "@type": "Offer", priceCurrency: "USD", price: pkg.price, description: `Starting price for ${pkg.name}` } } : {}),
        }}
      />
    </>
  );
}
