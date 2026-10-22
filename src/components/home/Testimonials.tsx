"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "motion/react";
import { testimonials } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

const P4_OUT = [0.165, 0.84, 0.44, 1] as const;

/** Testimonials carousel (autoplay with pause, arrows, dots, swipe, arrow keys). All entries are labelled samples. */
export function Testimonials() {
  const [ti, setTi] = useState(0);
  const [userPause, setUserPause] = useState(false);
  const [inViewState, setInView] = useState(false);
  const [hov, setHov] = useState(false);
  const [foc, setFoc] = useState(false);
  const [live, setLive] = useState<"off" | "polite">("off");
  const [dotKey, setDotKey] = useState(0);
  const tsRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const n = testimonials.length;

  useEffect(() => {
    const el = tsRef.current!;
    const io = new IntersectionObserver((es) => setInView(es[0].isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // word reveal on slide change
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!document.documentElement.classList.contains("x-anim")) return;
    const slide = tsRef.current?.querySelectorAll<HTMLElement>(".x-ts__slide")[ti];
    if (!slide) return;
    animate(Array.from(slide.querySelectorAll(".x-qw > span")), { y: ["115%", "0%"] }, { duration: 1, delay: stagger(0.035), ease: P4_OUT });
    animate(Array.from(slide.querySelectorAll(".x-pill, .x-author")), { opacity: [0, 1], y: [14, 0] }, { duration: 0.7, delay: stagger(0.1, { startDelay: 0.15 }) });
  }, [ti, dotKey]);

  const go = (next: number, user = false) => {
    const k = (next + n) % n;
    if (user) setLive("polite");
    if (k === ti) {
      if (user) setDotKey((d) => d + 1);
      return;
    }
    setTi(k);
  };

  const paused = !inViewState || hov || foc || userPause;

  return (
    <section className="x-sec x-sec--alt" id="testimonials">
      <div className="x-wrap">
        <SectionHeading eyebrow="Testimonials" title="What clients say" className="x-head x-reveal" />
        <div className="x-reveal">
        <div
          className={`x-ts${paused ? " is-paused" : ""}`}
          id="x-ts"
          ref={tsRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials (samples)"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              go(ti + (e.key === "ArrowRight" ? 1 : -1), true);
            }
          }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHov(true)}
          onPointerLeave={() => setHov(false)}
          onFocus={() => setFoc(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFoc(false);
          }}
        >
          <div
            className="x-ts__stage"
            aria-live={live}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const s = swipe.current;
              swipe.current = null;
              if (!s) return;
              const dx = e.clientX - s.x, dy = e.clientY - s.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(ti + (dx < 0 ? 1 : -1), true);
            }}
            onPointerCancel={() => (swipe.current = null)}
          >
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className={`x-ts__slide${i === ti ? " is-on" : ""}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                aria-hidden={i === ti ? undefined : true}
                inert={i !== ti}
              >
                {t.sample && <span className="x-pill">Sample testimonial</span>}
                <blockquote>
                  <p className="x-ts__q">
                    {t.quote.split(/\s+/).map((w, k) => (
                      <span key={k}>
                        <span className="x-qw">
                          <span>{w}</span>
                        </span>{" "}
                      </span>
                    ))}
                  </p>
                </blockquote>
                <figcaption>
                  <p className="x-author">
                    <b>{t.name}</b>, {t.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="x-ts__ctl">
            <div
              className="x-ts__dots"
              onAnimationEnd={(e) => {
                if (e.animationName === "x-tsfill") go(ti + 1);
              }}
            >
              {testimonials.map((_, i) => (
                <button
                  key={i === ti ? `on-${dotKey}` : i}
                  className="x-ts__dot"
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === ti ? "true" : undefined}
                  onClick={() => go(i, true)}
                >
                  <span>
                    <i />
                  </span>
                </button>
              ))}
            </div>
            <button
              className="x-ts__btn x-ts__play"
              type="button"
              aria-label={userPause ? "Resume autoplay" : "Pause autoplay"}
              aria-pressed={userPause}
              onClick={() => setUserPause((p) => !p)}
            >
              {userPause ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5l11 7-11 7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6v12M15 6v12" />
                </svg>
              )}
            </button>
            <button className="x-ts__btn x-ts__arrow x-mag" type="button" aria-label="Previous testimonial" onClick={() => go(ti - 1, true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <button className="x-ts__btn x-ts__arrow x-mag" type="button" aria-label="Next testimonial" onClick={() => go(ti + 1, true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
