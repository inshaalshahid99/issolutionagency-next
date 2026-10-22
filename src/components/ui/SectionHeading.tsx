"use client";

import { useEffect, useRef } from "react";
import { animate, inView, stagger } from "motion/react";

const P4_OUT = [0.165, 0.84, 0.44, 1] as const;

/**
 * Section heading (eyebrow + h2) with the preview's masked word reveal.
 * Words rise from a mask as the heading scrolls into view.
 */
export function SectionHeading({
  eyebrow,
  title,
  className = "x-head",
  as: Tag = "h2",
  id,
  children,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
  as?: "h1" | "h2";
  id?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("x-anim")) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".x-hw > span"));
    const ey = el.querySelector<HTMLElement>(".x-eyebrow");
    if (el.getBoundingClientRect().top < innerHeight * 0.88) return; // already visible: no flash
    animate(words, { y: "110%" }, { duration: 0 });
    if (ey) animate(ey, { opacity: 0, x: -20 }, { duration: 0 });
    return inView(
      el,
      () => {
        animate(words, { y: "0%" }, { duration: 1.1, delay: stagger(0.05), ease: P4_OUT });
        if (ey) animate(ey, { opacity: 1, x: 0 }, { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] });
      },
      { margin: "0px 0px -12% 0px" },
    );
  }, []);
  const words = title.split(" ");
  return (
    <div className={className} ref={ref}>
      {eyebrow && <p className="x-eyebrow">{eyebrow}</p>}
      <Tag id={id} aria-label={title}>
        <span aria-hidden="true">
          {words.map((w, i) => (
            <span key={i}>
              <span className="x-hw">
                <span>{w}</span>
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      </Tag>
      {children}
    </div>
  );
}
