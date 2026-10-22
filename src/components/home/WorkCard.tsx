import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/work";
import { ArrowUpRightSvg } from "@/components/ui/Icons";

/** Mock browser preview for each demo build (ported from the preview). */
function Mock({ p }: { p: Project }) {
  if (p.mock === "dash") {
    return (
      <div className="x-bw x-bw--dash" aria-hidden="true">
        <div className="x-bw__bar">
          <b />
          <b />
          <b />
          <span className="x-bw__url">{p.mockUrl}</span>
        </div>
        <div className="x-bw__scr">
          <div className="x-pb__side">
            <b />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="x-pb__main">
            <div className="x-pb__top">
              Overview <em>● Live</em>
            </div>
            <div className="x-pb__kpis">
              <div>
                <small>Active users</small>
                <strong>12.4k</strong>
                <span>+8.2%</span>
              </div>
              <div>
                <small>Conversion</small>
                <strong>3.8%</strong>
                <span>+0.4%</span>
              </div>
              <div>
                <small>MRR</small>
                <strong>$48.2k</strong>
                <span>+12%</span>
              </div>
            </div>
            <div className="x-pb__row">
              <div className="x-pb__card">
                <svg viewBox="0 0 200 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`x-pb-fill-${p.slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3B5BFD" stopOpacity=".22" />
                      <stop offset="1" stopColor="#3B5BFD" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 20H200M0 40H200M0 60H200" stroke="#e6e8f0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <path d="M0 64 L25 56 L50 60 L75 44 L100 48 L125 32 L150 36 L175 20 L200 14 V80 H0Z" fill={`url(#x-pb-fill-${p.slug})`} />
                  <polyline points="0,64 25,56 50,60 75,44 100,48 125,32 150,36 175,20 200,14" fill="none" stroke="#3B5BFD" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <polyline points="0,72 25,68 50,70 75,62 100,64 125,56 150,58 175,50 200,46" fill="none" stroke="#B8F35A" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                  <line x1="175" y1="20" x2="175" y2="80" stroke="#B8F35A" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="x-pb__card x-pb__bars">
                <p>
                  <b>Direct</b>
                  <i style={{ width: "88%" }} />
                </p>
                <p>
                  <b>Search</b>
                  <i style={{ width: "64%" }} />
                </p>
                <p>
                  <b>Social</b>
                  <i style={{ width: "41%" }} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const cafe = p.mock === "cafe";
  return (
    <div className={`x-bw x-bw--${p.mock}`} aria-hidden="true">
      <div className="x-bw__bar">
        <b />
        <b />
        <b />
        <span className="x-bw__url">{p.mockUrl}</span>
      </div>
      <div className="x-bw__scr">
        {p.image && <Image src={p.image.src} alt="" fill sizes="(max-width: 767px) 82vw, 560px" />}
        <div className="x-bw__nav">
          <strong>{cafe ? "Ember & Bean" : "LUMEA"}</strong>
          <span>
            {cafe ? (
              <>
                <em>Menu</em>
                <em>Journal</em>
                <em>Visit</em>
              </>
            ) : (
              <>
                <em>Shop</em>
                <em>Ritual</em>
                <em>About</em>
                <i className="x-bw__bag">
                  <i>2</i>
                </i>
              </>
            )}
          </span>
        </div>
        <p className="x-bw__hl">
          {cafe ? "Slow coffee for fast mornings." : "Skin, simplified."}
          <br />
          <span className="x-bw__cta">{cafe ? "See the menu" : "Shop the edit"}</span>
        </p>
      </div>
    </div>
  );
}

export function WorkCard({ p, index = 0, hidden = false, headingLevel = "h3" }: { p: Project; index?: number; hidden?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article
      className={`x-card x-work x-tilt${hidden ? " is-hidden" : ""}`}
      data-cur="View"
      style={index ? ({ "--d": index } as React.CSSProperties) : undefined}
      data-cat={p.filters.join(" ")}
    >
      <div className="x-mock">
        <span className="x-tag">Demo build</span>
        <div className="x-mock__in" style={{ background: p.mockBg }}>
          <Mock p={p} />
        </div>
      </div>
      <div className="x-work__body">
        <span className="x-cat">{p.category}</span>
        <H>{p.title}</H>
        <p className="x-work__desc">{p.description}</p>
        <ul className="x-work__tags" aria-label="Stack">
          {p.tags.map((t) => (
            <li className="x-pill" key={t}>
              {t}
            </li>
          ))}
        </ul>
        <div className="x-work__links">
          <a className="x-more" href={p.demoHref} target="_blank" rel="noopener">
            <span>View live demo</span>
            <ArrowUpRightSvg />
            <span className="sr-only"> of {p.title} (opens in a new tab)</span>
          </a>
          <Link className="x-more x-more--plain" href={`/work/${p.slug}`}>
            Case study<span className="sr-only">: {p.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
