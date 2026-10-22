import Link from "next/link";
import { differentiation } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckSvg } from "@/components/ui/Icons";
import { AuditButton } from "./AuditButton";

export function Differentiation() {
  return (
    <section className="x-sec" id="diff">
      <div className="x-blob x-blob--b" style={{ top: "30%", bottom: "auto", right: -160, opacity: 0.14 }} />
      <div className="x-wrap">
        <SectionHeading eyebrow={differentiation.eyebrow} title={differentiation.title} />
        <div className="x-diff">
          <div className="x-diff__hd" aria-hidden="true">
            <span>Typical agency</span>
            <span>
              <i className="x-pulse" />
              <span className="x-grad-text">ISSolutionAgency</span>
            </span>
          </div>
          <ul className="x-diff__list">
            {differentiation.rows.map((r, i) => (
              <li key={r.title} className="x-diff__row x-reveal" style={i ? ({ "--d": i } as React.CSSProperties) : undefined}>
                <p className="x-diff__old">
                  <span className="x-diff__x" aria-hidden="true" />
                  <span>
                    <span className="x-diff__tag">Typical: </span>
                    <s>{r.old}</s>
                  </span>
                </p>
                <div className="x-diff__new x-tilt">
                  <span className="x-diff__ok" aria-hidden="true">
                    <CheckSvg />
                  </span>
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="x-diff__cta x-reveal">
          <p>Not sure where to start?</p>
          <div className="x-ctas">
            <AuditButton />
            <Link className="x-btn x-mag" href="#contact">
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
