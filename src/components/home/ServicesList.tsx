"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, inView, stagger } from "motion/react";
import { services } from "@/content/services";
import { ArrowRightSvg, ServiceGlyph } from "@/components/ui/Icons";
import { isFinePointer, isLite } from "@/lib/motion-prefs";

/** Big hover list of services: accordion on all sizes + cursor-following preview card on desktop. */
export function ServicesList({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLUListElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{ slug: string; on: boolean }>({ slug: services[0].slug, on: false });
  const H = headingLevel;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cleanups: (() => void)[] = [];
    if (document.documentElement.classList.contains("x-anim")) {
      const items = Array.from(list.children) as HTMLElement[];
      if (list.getBoundingClientRect().top > innerHeight * 0.85) {
        animate(items, { opacity: 0, y: 40 }, { duration: 0 });
        cleanups.push(
          inView(list, () => {
            animate(items, { opacity: 1, y: 0 }, { duration: 0.9, delay: stagger(0.06), ease: [0.215, 0.61, 0.355, 1] });
          }, { margin: "0px 0px -15% 0px" }),
        );
      }
    }
    if (isFinePointer() && !isLite() && prevRef.current) {
      const pv = prevRef.current;
      let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
      const loop = () => {
        x += (tx - x) * 0.12;
        y += (ty - y) * 0.12;
        pv.style.transform = `translate3d(${x}px,${y}px,0)`;
        raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
      };
      const move = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      list.addEventListener("pointermove", move);
      cleanups.push(() => {
        list.removeEventListener("pointermove", move);
        cancelAnimationFrame(raf);
      });
    }
    return () => cleanups.forEach((f) => f());
  }, []);

  const showPreview = (slug: string, on: boolean) => {
    if (!isFinePointer() || isLite() || innerWidth < 768) return;
    setPreview({ slug, on });
  };
  const pv = services.find((s) => s.slug === preview.slug)!;

  return (
    <>
      <ul className="x-svc" id="x-svc" ref={listRef}>
        {services.map((s, i) => {
          const isOpen = !!open[s.slug];
          const panelId = `sv${i + 1}`;
          return (
            <li
              key={s.slug}
              data-cur="Open"
              id={s.slug === "ai-chatbots-and-automation" ? "svc-ai" : s.slug === "ai-app-rescue" ? "svc-rescue" : undefined}
              className={isOpen ? "is-open" : undefined}
              onPointerEnter={(e) => e.pointerType === "mouse" && showPreview(s.slug, true)}
              onPointerLeave={() => showPreview(s.slug, false)}
            >
              <H style={{ margin: 0, font: "inherit" }}>
                <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen((o) => ({ ...o, [s.slug]: !o[s.slug] }))}>
                  <span className="x-svc__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="x-svc__t">{s.title}</span>
                  <span className="x-svc__a">
                    <ArrowRightSvg />
                  </span>
                </button>
              </H>
              <div className="x-svc__d" id={panelId} inert={!isOpen}>
                <div>
                  <div className="x-svc__in">
                    <div className="x-icon">
                      <ServiceGlyph name={s.icon} />
                    </div>
                    <div>
                      <p>{s.short}</p>
                      <Link className="x-more" href={`/services/${s.slug}`}>
                        Learn more<span className="sr-only"> about {s.title}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={`x-prev${preview.on ? " is-on" : ""}`} ref={prevRef} aria-hidden="true">
        <div className="x-icon">
          <ServiceGlyph name={pv.icon} />
        </div>
        <p>{pv.short}</p>
      </div>
    </>
  );
}
