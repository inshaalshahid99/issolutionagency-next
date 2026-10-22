"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds `is-in` to `.x-reveal` elements as they enter the viewport (fade-up). */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scan = () => Array.from(document.querySelectorAll<HTMLElement>(".x-reveal:not(.is-in)"));
    if (reduce || !("IntersectionObserver" in window)) {
      const show = () => scan().forEach((el) => el.classList.add("is-in"));
      show();
      const mo = new MutationObserver(show);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const seen = new WeakSet<Element>();
    const observe = () =>
      scan().forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
