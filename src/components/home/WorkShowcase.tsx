"use client";

import { useEffect, useRef, useState } from "react";
import { projects, workFilters, type WorkFilter } from "@/content/work";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkCard } from "./WorkCard";
import { loadGsap, navS } from "@/lib/gsap";

/**
 * Selected work: category filters + horizontal track. On desktop (with motion)
 * the section pins and the track scrolls sideways (GSAP ScrollTrigger, lazy-loaded).
 */
export function WorkShowcase() {
  const [filter, setFilter] = useState<"all" | WorkFilter>("all");
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const refreshRef = useRef<() => void>(() => {});

  // mobile / no-pin progress bar from native horizontal scroll
  const setProg = () => {
    const track = trackRef.current;
    const prog = progRef.current;
    if (!track || !prog || getComputedStyle(track).overflowX === "visible") return;
    const m = track.scrollWidth - track.clientWidth;
    prog.style.transform = `scaleX(${m > 0 ? track.scrollLeft / m : 1})`;
  };

  useEffect(() => {
    const sec = secRef.current!;
    const track = trackRef.current!;
    track.addEventListener("scroll", setProg, { passive: true });
    setProg();
    if (!document.documentElement.classList.contains("x-anim")) return () => track.removeEventListener("scroll", setProg);

    let killed = false;
    let ctx: { revert: () => void } | null = null;
    let io: IntersectionObserver | null = null;
    const build = async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (killed) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const dist = () => Math.max(0, track.scrollWidth - innerWidth);
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: () => "top " + navS() + "px",
            end: () => "+=" + Math.max(1, dist()),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              if (progRef.current) progRef.current.style.transform = `scaleX(${s.progress})`;
            },
          },
        });
        gsap.from(track.querySelectorAll(".x-work:not(.is-hidden)"), {
          autoAlpha: 0,
          x: 120,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: sec, start: "top 75%" },
        });
      });
      ctx = mm;
      refreshRef.current = () => ScrollTrigger.refresh();
      ScrollTrigger.refresh();
    };
    // build ~1 viewport before the section shows
    io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          io?.disconnect();
          build();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(sec);
    return () => {
      killed = true;
      io?.disconnect();
      ctx?.revert();
      track.removeEventListener("scroll", setProg);
    };
  }, []);

  const choose = (f: "all" | WorkFilter) => {
    setFilter(f);
    requestAnimationFrame(() => {
      if (trackRef.current) trackRef.current.scrollLeft = 0;
      refreshRef.current();
      setProg();
    });
  };

  return (
    <div className="x-pinwrap">
    <section className="x-sec x-work-sec" id="work" ref={secRef}>
      <div className="x-wrap x-work-head">
        <SectionHeading eyebrow="Work" title="Selected work" />
        <div className="x-filters" role="group" aria-label="Filter projects">
          {workFilters.map((f) => (
            <button key={f.id} className="x-chip" type="button" aria-pressed={filter === f.id} onClick={() => choose(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="x-hs">
        <div className="x-hs__track" id="x-work" ref={trackRef}>
          {projects.map((p, i) => (
            <WorkCard key={p.slug} p={p} index={i} hidden={filter !== "all" && !p.filters.includes(filter)} />
          ))}
        </div>
        <div className="x-hs__bar">
          <i id="x-hs-prog" ref={progRef} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {filter === "all" ? `Showing all ${projects.length} projects` : `Showing ${projects.filter((p) => p.filters.includes(filter)).length} projects`}
      </p>
    </section>
    </div>
  );
}
