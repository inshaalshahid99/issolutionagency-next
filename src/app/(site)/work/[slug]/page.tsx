import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightSvg, CheckSvg } from "@/components/ui/Icons";
import { getProject, projects } from "@/content/work";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({ title: `${p.title} (demo build)`, description: `${p.description} A demo build by ISSolutionAgency.`, path: `/work/${p.slug}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const cs = p.caseStudy;
  const next = projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length];

  return (
    <>
      <PageHero eyebrow={`Demo build · ${p.category}`} title={p.title} lead={p.description} crumbs={[{ label: "Work", href: "/work" }, { label: p.title }]}>
        <div className="x-ctas mt-8">
          <a className="x-btn x-btn--grad x-mag" href={p.demoHref} target="_blank" rel="noopener">
            View live demo <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Link className="x-btn x-mag" href="/contact">
            Start a similar project
          </Link>
        </div>
      </PageHero>

      <section className="x-sec" style={{ paddingTop: 0 }}>
        <div className="x-wrap">
          <div className="x-cs-media x-reveal">
            {p.image ? (
              <Image src={p.image.src} alt={p.image.alt} fill priority sizes="(max-width: 1240px) 100vw, 1200px" />
            ) : (
              <div className="x-mock__in" style={{ background: p.mockBg }}>
                <div className="x-bw x-bw--dash" aria-hidden="true">
                  <div className="x-bw__bar">
                    <b />
                    <b />
                    <b />
                    <span className="x-bw__url">{p.mockUrl}</span>
                  </div>
                  <div className="x-bw__scr" style={{ display: "grid", placeItems: "center", color: "#1a1f36", fontWeight: 600 }}>
                    Live, interactive dashboard: open the demo to explore.
                  </div>
                </div>
              </div>
            )}
            <span className="x-tag" style={{ position: "absolute", top: 18, left: 18, zIndex: 2 }}>
              Demo build
            </span>
          </div>
          <div className="x-demo-note mt-6">
            <span aria-hidden="true">ⓘ</span>
            <p className="m-0">{cs.note}</p>
          </div>
        </div>
      </section>

      <section className="x-sec x-sec--alt">
        <div className="x-wrap grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="x-reveal">
            <p className="x-eyebrow">The brief</p>
            <p className="text-[clamp(19px,1.4vw+12px,26px)] leading-snug m-0">{cs.brief}</p>
          </div>
          <div className="x-reveal" style={{ "--d": 1 } as React.CSSProperties}>
            <p className="x-eyebrow">Goals</p>
            <ul className="m-0 grid gap-4 p-0 list-none">
              {cs.goals.map((g) => (
                <li key={g} className="flex gap-3">
                  <span className="x-svc-check" aria-hidden="true">
                    <CheckSvg />
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="x-sec">
        <div className="x-wrap">
          <SectionHeading eyebrow="Approach" title="How we built it" className="x-head x-reveal" />
          <div className="x-grid">
            {cs.approach.map((a, i) => (
              <article key={a.title} className="x-card x-tilt x-reveal" style={{ "--d": i } as React.CSSProperties}>
                <span className="x-num x-grad-text text-[48px] font-semibold" style={{ fontFamily: "var(--x-head)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 mb-2 text-[22px]">{a.title}</h3>
                <p className="text-muted m-0">{a.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="x-reveal">
              <h2 className="text-[clamp(24px,2.4vw,32px)] mb-5">Features</h2>
              <ul className="m-0 grid gap-3 p-0 list-none">
                {cs.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="x-svc-check" aria-hidden="true">
                      <CheckSvg />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="x-reveal" style={{ "--d": 1 } as React.CSSProperties}>
              <h2 className="text-[clamp(24px,2.4vw,32px)] mb-5">Stack</h2>
              <ul className="x-work__tags" aria-label="Stack">
                {cs.stack.map((t) => (
                  <li className="x-pill" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
              <a className="x-more mt-6" href={p.demoHref} target="_blank" rel="noopener">
                Open the live demo <ArrowUpRightSvg />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="x-sec x-sec--alt" style={{ paddingBlock: "clamp(48px, 7vw, 96px)" }}>
        <div className="x-wrap flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="x-eyebrow">Next demo build</p>
            <p className="m-0 text-[clamp(28px,3.4vw,48px)] font-semibold tracking-tight" style={{ fontFamily: "var(--x-head)" }}>
              {next.title}
            </p>
          </div>
          <Link className="x-btn x-mag" href={`/work/${next.slug}`}>
            View case study →
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
