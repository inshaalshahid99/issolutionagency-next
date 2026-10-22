"use client";

import { useEffect, useRef } from "react";
import { animate, inView, stagger } from "motion/react";
import { scrollToHash } from "@/lib/scroll";

export function BackToTop() {
  return (
    <a
      className="x-top x-mag"
      href="#top"
      aria-label="Back to top"
      onClick={(e) => {
        e.preventDefault();
        scrollToHash("#top");
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      Top
    </a>
  );
}

/** Giant outlined wordmark whose letters rise and fill with the gradient. */
export function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!document.documentElement.classList.contains("x-anim")) {
      el.classList.add("is-in");
      return;
    }
    const spans = Array.from(el.querySelectorAll("span"));
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight) animate(spans, { y: "110%", opacity: 0 }, { duration: 0 });
    return inView(
      el.parentElement || el,
      () => {
        el.classList.add("is-in");
        animate(spans, { y: "0%", opacity: 1 }, { duration: 1, delay: stagger(0.04), ease: [0.165, 0.84, 0.44, 1] });
      },
      { amount: 0.2 },
    );
  }, []);
  return (
    <p className="x-word" id="x-word" ref={ref} aria-hidden="true">
      {text.split("").map((c, i) => (
        <span key={i} style={{ ["--i" as string]: i } as React.CSSProperties}>
          {c}
        </span>
      ))}
    </p>
  );
}
