"use client";

import { useEffect, useRef } from "react";
import { outcomes } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OutcomeGlyph } from "@/components/ui/Icons";
import { loadGsap, navS } from "@/lib/gsap";

/** Stacking sticky cards; earlier cards shrink and dim as the next arrives. */
export function Outcomes() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stack = ref.current!;
    if (!document.documentElement.classList.contains("x-anim")) return;
    let killed = false;
    let ctx: { revert: () => void } | null = null;
    const build = async () => {
      const { gsap } = await loadGsap();
      if (killed) return;
      ctx = gsap.context(() => {
        const sc = Array.from(stack.querySelectorAll<HTMLElement>(".x-card"));
        sc.forEach((c, i) => {
          if (i === sc.length - 1) return;
          gsap.to(c, {
            scale: 0.92,
            filter: "brightness(0.5)",
            ease: "none",
            scrollTrigger: { trigger: sc[i + 1], start: "top bottom", end: () => "top " + (navS() + 32 + (i + 1) * 18) + "px", invalidateOnRefresh: true, scrub: true },
          });
        });
      });
    };
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          io.disconnect();
          build();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(stack);
    return () => {
      killed = true;
      io.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section className="x-sec" id="outcomes">
      <div className="x-wrap">
        <SectionHeading eyebrow={outcomes.eyebrow} title={outcomes.title} className="x-head x-reveal" />
        <div className="x-stack" id="x-stack" ref={ref}>
          {outcomes.items.map((o, i) => (
            <article className="x-card" key={o.title} style={{ "--i": i } as React.CSSProperties}>
              <span className="x-stack__n">
                {String(i + 1).padStart(2, "0")} / {String(outcomes.items.length).padStart(2, "0")}
              </span>
              <div className="x-icon">
                <OutcomeGlyph name={o.icon} />
              </div>
              <h3>{o.title}</h3>
              <p>{o.body}</p>
            </article>
          ))}
        </div>
        <p className="x-note x-reveal">
          <span className="x-pill">Placeholder</span>
          {outcomes.note}
        </p>
      </div>
    </section>
  );
}
