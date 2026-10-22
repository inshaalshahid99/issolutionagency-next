"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

export function getLenis() {
  return lenis;
}

/** Compact header height, used as the offset for anchor scrolls. */
export function navOffset() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--x-navh-s"));
  return Number.isFinite(v) && v > 0 ? v : 60;
}

/** Smoothly scroll to "#id" (or "#top"), using Lenis when it is running. */
export function scrollToHash(hash: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hash === "#top" || hash === "#") {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return;
  window.dispatchEvent(new CustomEvent("iss:before-anchor", { detail: el }));
  if (lenis) lenis.scrollTo(el, { duration: 1.4, offset: -navOffset() });
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  if (history.replaceState) history.replaceState(null, "", hash);
}
