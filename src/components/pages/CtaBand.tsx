import Link from "next/link";

/** Closing call to action used on inner pages. */
export function CtaBand({
  title = "Have a web project in mind?",
  body = "Tell us about your goals and we'll reply within one business day.",
  href = "/contact",
  label = "Start a project",
  secondary,
}: {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="x-sec">
      <div className="x-blob x-blob--a" style={{ top: "10%", left: "35%", opacity: 0.18 }} />
      <div className="x-wrap">
        <div className="x-panel x-reveal" style={{ gridTemplateColumns: "1fr", textAlign: "center", justifyItems: "center" }}>
          <h2 className="x-big" style={{ margin: 0, fontSize: "clamp(36px, 6vw, 88px)" }}>
            <span className="x-grad-text">{title}</span>
          </h2>
          <p className="x-lead" style={{ margin: "0 auto" }}>
            {body}
          </p>
          <div className="x-ctas" style={{ justifyContent: "center" }}>
            <Link className="x-btn x-btn--grad x-mag" href={href}>
              {label}
            </Link>
            {secondary && (
              <Link className="x-btn x-mag" href={secondary.href}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
