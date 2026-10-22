"use client";

import { useEffect, useRef } from "react";
import { techStack } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Two infinite marquees whose speed and direction follow scroll velocity. */
export function TechMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const rows = [techStack.slice(0, 9), techStack.slice(9)];

  useEffect(() => {
    const tk = ref.current;
    if (!tk || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracks = Array.from(tk.querySelectorAll<HTMLElement>(".x-tk__track")).map((t) => ({
      el: t,
      ul: t.firstElementChild as HTMLElement,
      dir: Number(t.dataset.dir),
      x: 0,
    }));
    let vel = 0, boost = 0, sdir = 1, on = true, lastSY = window.scrollY, lastT = performance.now(), raf = 0;
    const io = new IntersectionObserver((es) => (on = es[0].isIntersecting));
    io.observe(tk);
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const v = dt ? (window.scrollY - lastSY) / dt : 0;
      lastSY = window.scrollY;
      vel = vel * 0.8 + v * 0.2;
      if (vel > 40) sdir = 1;
      else if (vel < -40) sdir = -1;
      boost += (Math.min(Math.abs(vel) / 220, 14) - boost) * 0.08;
      if (on)
        tracks.forEach((r) => {
          const w = r.ul.offsetWidth;
          if (!w) return;
          r.x += r.dir * sdir * 70 * (1 + boost) * dt;
          r.x = ((r.x % w) - w) % w;
          r.el.style.transform = `translate3d(${r.x}px,0,0)`;
        });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <section className="x-sec x-sec--alt" id="stack">
      <div className="x-wrap">
        <SectionHeading eyebrow="Tech stack" title="The right stack for the job" />
      </div>
      <div className="x-tk x-reveal" id="x-tk" ref={ref}>
        {rows.map((row, ri) => (
          <div className="x-tk__row" key={ri}>
            <div className="x-tk__track" data-dir={ri === 0 ? -1 : 1}>
              <ul aria-label={`Technologies, part ${ri + 1}`}>
                {row.map((t) => (
                  <li key={t}>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <ul aria-hidden="true">
                {row.map((t) => (
                  <li key={t}>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
