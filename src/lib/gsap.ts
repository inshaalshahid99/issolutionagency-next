"use client";

import { getLenis } from "./scroll";

type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let promise: Promise<GsapBundle> | null = null;

/**
 * Lazy-loads GSAP + ScrollTrigger (only the pinned scroll-story sections use it)
 * and wires ScrollTrigger to Lenis.
 */
export function loadGsap(): Promise<GsapBundle> {
  if (!promise) {
    promise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const hook = (l: { on: (e: "scroll", cb: () => void) => void } | null) => l?.on("scroll", () => ScrollTrigger.update());
      hook(getLenis());
      window.addEventListener("iss:lenis", (e) => hook((e as CustomEvent).detail));
      window.addEventListener("iss:loader-done", () => ScrollTrigger.refresh());
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return { gsap, ScrollTrigger };
    });
  }
  return promise;
}

/** Height of the compact header (pin offset). */
export function navS() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--x-navh-s"));
  return Number.isFinite(v) && v > 0 ? v : 60;
}
