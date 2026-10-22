"use client";

import { useEffect, useRef } from "react";
import { animate, inView, stagger } from "motion/react";
import { whyUs } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyUs({ id = "about" }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("x-anim")) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.82) return;
    const cards = Array.from(el.children) as HTMLElement[];
    animate(cards, { opacity: 0, y: 80, rotateX: -12 }, { duration: 0 });
    return inView(
      el,
      () => {
        animate(cards, { opacity: 1, y: 0, rotateX: 0 }, { duration: 1, delay: stagger(0.12), ease: [0.215, 0.61, 0.355, 1] });
      },
      { margin: "0px 0px -18% 0px" },
    );
  }, []);
  return (
    <section className="x-sec x-sec--alt" id={id}>
      <div className="x-wrap">
        <SectionHeading eyebrow={whyUs.eyebrow} title={whyUs.title} />
        <div className="x-why2" ref={ref}>
          {whyUs.items.map((it, i) => (
            <article className="x-card x-tilt" key={it.title}>
              <span className="x-num x-grad-text">{String(i + 1).padStart(2, "0")}</span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
