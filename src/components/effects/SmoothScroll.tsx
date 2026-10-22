"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, scrollToHash, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling (skipped for reduced motion) and smooth in-page
 * anchor links that account for the fixed header.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let lenis: Lenis | null = null;
    if (root.classList.contains("x-anim")) {
      lenis = new Lenis({ lerp: 0.1, autoRaf: true });
      setLenis(lenis);
      window.dispatchEvent(new CustomEvent("iss:lenis", { detail: lenis }));
    }
    const onLock = (e: Event) => {
      const l = getLenis();
      if (!l) return;
      if ((e as CustomEvent<boolean>).detail) l.stop();
      else l.start();
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.classList.contains("x-skip") || a.target === "_blank") return;
      const href = a.getAttribute("href") || "";
      if (!href.includes("#")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = url.hash === "#top" ? document.body : document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToHash(url.hash);
    };
    window.addEventListener("iss:scroll-lock", onLock);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("iss:scroll-lock", onLock);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  // keep Lenis in sync with route changes (new page height, scroll to top)
  useEffect(() => {
    const l = getLenis();
    if (!l) return;
    l.resize();
    if (!location.hash) l.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
