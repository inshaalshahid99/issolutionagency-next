"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { processSteps } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loadGsap, navS } from "@/lib/gsap";

/**
 * "How we work": pinned on desktop, the line fills and the big counter rolls
 * through the six steps (GSAP ScrollTrigger, lazy-loaded). Scrubbed on mobile.
 */
export function ProcessTimeline({ title = "How we work", eyebrow = "Process" }: { title?: string; eyebrow?: string }) {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current!;
    if (!document.documentElement.classList.contains("x-anim")) return;
    const steps = Array.from(sec.querySelectorAll<HTMLLIElement>(".x-tl__list > li"));
    const fill = sec.querySelector<HTMLElement>(".x-tl__fill")!;
    const pnum = sec.querySelector<HTMLElement>(".x-proc__num span")!;
    const pname = sec.querySelector<HTMLElement>(".x-proc__name")!;
    let cur = -1;
    const setStep = (i: number) => {
      if (i === cur) return;
      const dir = i > cur ? 1 : -1;
      cur = i;
      steps.forEach((li, k) => {
        li.classList.toggle("is-cur", k === i);
        li.classList.toggle("is-lit", k <= i);
      });
      pnum.textContent = String(i + 1).padStart(2, "0");
      pname.textContent = steps[i].querySelector("h3")?.textContent || "";
      animate(pnum, { y: [`${100 * dir}%`, "0%"] }, { duration: 0.6, ease: [0.165, 0.84, 0.44, 1] });
      animate(pname, { opacity: [0, 1], y: [16 * dir, 0] }, { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] });
    };

    let killed = false;
    let mmRef: { revert: () => void } | null = null;
    const build = async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (killed) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        setStep(0);
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: () => "top " + navS() + "px",
              end: () => "+=" + innerHeight * 2.2,
              invalidateOnRefresh: true,
              pin: true,
              scrub: true,
              onUpdate: (s) => setStep(Math.min(steps.length - 1, Math.floor(s.progress * steps.length))),
            },
          },
        );
      });
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: sec.querySelector(".x-tl"), start: "top 70%", end: "bottom 60%", scrub: true } });
        steps.forEach((li) =>
          ScrollTrigger.create({
            trigger: li,
            start: "top 72%",
            end: "max",
            onToggle: (s) => {
              const on = s.isActive || s.progress > 0;
              li.classList.toggle("is-cur", on);
              li.classList.toggle("is-lit", on);
            },
          }),
        );
      });
      mmRef = mm;
      ScrollTrigger.refresh();
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
    io.observe(sec);
    return () => {
      killed = true;
      io.disconnect();
      mmRef?.revert();
    };
  }, []);

  return (
    <div className="x-pinwrap">
      <section className="x-sec" id="process" ref={secRef}>
        <div className="x-wrap">
          <div className="x-proc">
            <div>
              <SectionHeading eyebrow={eyebrow} title={title} />
              <div className="x-proc__count" aria-hidden="true">
                <div className="x-proc__num">
                  <span id="x-pnum" className="x-grad-text">
                    01
                  </span>
                </div>
                <p className="x-proc__of">Step / {String(processSteps.length).padStart(2, "0")}</p>
                <p className="x-proc__name" id="x-pname">
                  {processSteps[0].title}
                </p>
              </div>
            </div>
            <div className="x-tl" id="x-tl">
              <span className="x-tl__line" aria-hidden="true">
                <span className="x-tl__fill" id="x-tl-fill" />
              </span>
              <ol className="x-tl__list">
                {processSteps.map((s, i) => (
                  <li key={s.title}>
                    <span className="x-tl__dot" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
