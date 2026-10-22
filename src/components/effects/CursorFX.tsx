"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { isFinePointer, isLite } from "@/lib/motion-prefs";

/**
 * Custom cursor (dot + ring with labels from [data-cur]), magnetic `.x-mag`
 * buttons and `.x-tilt` card tilt. All disabled on touch, reduced motion,
 * save-data and low-power devices (the `x-lite` class).
 */
export function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isLite() || !isFinePointer()) return;
    const root = document.documentElement;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    root.classList.add("x-hascur");

    let tx = -100, ty = -100, rx = -100, ry = -100, dx = -100, dy = -100, raf = 0;
    const loop = () => {
      dx += (tx - dx) * 0.6;
      dy += (ty - dy) * 0.6;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let magEl: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as Element;
      // magnetic buttons
      const mag = t.closest?.(".x-mag") as HTMLElement | null;
      if (magEl && magEl !== mag) {
        animate(magEl, { x: 0, y: 0 }, { type: "spring", stiffness: 180, damping: 9, mass: 0.6 });
        magEl = null;
      }
      if (mag) {
        magEl = mag;
        const r = mag.getBoundingClientRect();
        animate(mag, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.45 }, { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] });
      }
      // tilt + glow
      const tilt = t.closest?.(".x-tilt") as HTMLElement | null;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        tilt.style.setProperty("--ry", (x - 0.5) * 10 + "deg");
        tilt.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
        tilt.style.setProperty("--mx", x * 100 + "%");
        tilt.style.setProperty("--my", y * 100 + "%");
      }
    };
    const onOut = (e: PointerEvent) => {
      const tilt = (e.target as Element).closest?.(".x-tilt") as HTMLElement | null;
      if (tilt && !tilt.contains(e.relatedTarget as Node)) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      const big = t.closest?.("[data-cur]") as HTMLElement | null;
      const link = t.closest?.("a, button, select, input, textarea");
      const text = big ? big.dataset.cur || "" : link && link.matches(".x-more, .x-bar a") ? "Open" : "";
      ring.classList.toggle("is-big", !!text);
      ring.classList.toggle("is-link", !text && !!link);
      label.textContent = text;
    };
    const hide = () => {
      dot.classList.add("is-off");
      ring.classList.add("is-off");
    };
    const show = () => {
      dot.classList.remove("is-off");
      ring.classList.remove("is-off");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.documentElement.addEventListener("pointerleave", hide);
    document.documentElement.addEventListener("pointerenter", show);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("x-hascur");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.documentElement.removeEventListener("pointerenter", show);
    };
  }, []);

  return (
    <>
      <div className="x-cur" ref={dotRef} aria-hidden="true" />
      <div className="x-ring" ref={ringRef} aria-hidden="true">
        <span ref={labelRef} />
      </div>
    </>
  );
}
