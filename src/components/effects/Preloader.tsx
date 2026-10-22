"use client";

import { useEffect, useRef } from "react";
import { animate, motionValue, stagger } from "motion/react";
import { site } from "@/content/site";

/**
 * Prism-cube preloader (~1.85s, once per session, skippable).
 * Shown only when the boot script set `x-anim` and not `x-noload`
 * (CSS keeps it hidden otherwise, and a 4s CSS bail-out hides it if JS fails).
 * Dispatches `iss:loader-out` when the exit starts so the hero can enter.
 */
declare global {
  interface Window {
    __issLoader?: "running" | "out" | "done" | "skipped";
  }
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const P2_INOUT = [0.45, 0, 0.55, 1] as const;
const P3_OUT = [0.215, 0.61, 0.355, 1] as const;
const P4_INOUT = [0.76, 0, 0.24, 1] as const;
const OUT_AT = 1.29;

const word = site.name;
const ag = word.indexOf("Agency");

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const L = ref.current;
    const root = document.documentElement;
    if (!L) return;
    const active = root.classList.contains("x-anim") && !root.classList.contains("x-noload");
    if (!active) {
      window.__issLoader = "skipped";
      L.style.display = "none";
      return;
    }
    window.__issLoader = "running";
    root.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("iss:scroll-lock", { detail: true }));

    const q = <T extends Element = HTMLElement>(s: string) => L.querySelector<T>(s)!;
    const qa = <T extends Element = HTMLElement>(s: string) => Array.from(L.querySelectorAll<T>(s));
    const strips = qa(".x-loader__d > span");
    const ringP = q<SVGCircleElement>(".x-loader__ring .p");
    const sPath = q<SVGPathElement>(".x-loader__s");
    const iPath = q<SVGPathElement>(".x-loader__i");
    [sPath, iPath].forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    const setCount = (v: number) => {
      let o = v % 10;
      let t = (Math.floor(v / 10) % 10) + Math.max(0, o - 9);
      let h = Math.max(0, Math.min(1, v - 99));
      if (v >= 100) {
        o = 0;
        t = 0;
        h = 1;
      }
      strips[0].style.transform = `translateY(${-h}em)`;
      strips[1].style.transform = `translateY(${-t}em)`;
      strips[2].style.transform = `translateY(${-o}em)`;
      ringP.style.strokeDashoffset = String(100 - v);
    };
    setCount(0);
    const count = motionValue(0);
    const unsub = count.on("change", setCount);
    const st = qa(".x-loader__st span");
    const sh = qa(".x-loader__sh i");
    const markSpans = qa(".x-loader__mark span");

    const controls = animate([
      [q(".x-loader__glow"), { opacity: [0, 1] }, { duration: 0.45, at: 0 }],
      [q(".x-loader__ring"), { opacity: [0, 1], scale: [0.85, 1] }, { duration: 0.4, ease: EXPO_OUT, at: 0.03 }],
      [qa(".x-loader__orb"), { opacity: [0, 1] }, { duration: 0.34, at: 0.17 }],
      [q(".x-loader__f--t"), { x: [30, 0], y: [-150, 0], rotate: [-45, 0], scale: [0.5, 1], opacity: [0, 1], filter: ["blur(14px)", "blur(0px)"] }, { duration: 0.5, ease: "backOut", at: 0.06 }],
      [q(".x-loader__f--l"), { x: [-170, 0], y: [70, 0], rotate: [35, 0], scale: [0.5, 1], opacity: [0, 1], filter: ["blur(14px)", "blur(0px)"] }, { duration: 0.5, ease: "backOut", at: 0.11 }],
      [q(".x-loader__f--r"), { x: [170, 0], y: [90, 0], rotate: [-30, 0], scale: [0.5, 1], opacity: [0, 1], filter: ["blur(14px)", "blur(0px)"] }, { duration: 0.5, ease: EXPO_OUT, at: 0.17 }],
      [q(".x-loader__f--e"), { opacity: [0, 1] }, { duration: 0.22, at: 0.53 }],
      [sPath, { strokeDashoffset: 0 }, { duration: 0.36, ease: P2_INOUT, at: 0.56 }],
      [iPath, { strokeDashoffset: 0 }, { duration: 0.22, ease: "easeOut", at: 0.73 }],
      [q(".x-loader__sheen i"), { x: ["-120%", "340%"], skewX: [-18, -18] }, { duration: 0.48, ease: P2_INOUT, at: 0.87 }],
      [count, 100, { duration: 1.12, ease: P2_INOUT, at: 0.06 }],
      [markSpans, { y: ["110%", "0%"], opacity: [0, 1] }, { duration: 0.34, delay: stagger(0.02), ease: P3_OUT, at: 0.22 }],
      [st[0], { opacity: [0, 1], y: ["100%", "0%"] }, { duration: 0.2, at: 0.14 }],
      [st[0], { opacity: 0, y: "-100%" }, { duration: 0.17, at: 0.53 }],
      [st[1], { opacity: [0, 1], y: ["100%", "0%"] }, { duration: 0.2, at: 0.56 }],
      [st[1], { opacity: 0, y: "-100%" }, { duration: 0.17, at: 0.92 }],
      [st[2], { opacity: [0, 1], y: ["100%", "0%"] }, { duration: 0.2, at: 0.95 }],
      [q(".x-loader__cube"), { scale: 1.14 }, { duration: 0.2, ease: "backOut", at: 1.18 }],
      [q(".x-loader__halo"), { opacity: 1, scale: 1.1 }, { duration: 0.2, ease: "easeOut", at: 1.18 }],
      [q(".x-loader__c"), { opacity: 0, scale: 0.97 }, { duration: 0.17, ease: "easeIn", at: OUT_AT }],
      [sh, { y: "-100%" }, { duration: 0.36, delay: stagger(0.03), ease: P4_INOUT, at: 1.34 }],
    ]);

    let outSent = false;
    let raf = 0;
    const sendOut = () => {
      if (outSent) return;
      outSent = true;
      window.__issLoader = "out";
      window.dispatchEvent(new Event("iss:loader-out"));
    };
    const watch = () => {
      if (controls.time >= OUT_AT) sendOut();
      else raf = requestAnimationFrame(watch);
    };
    raf = requestAnimationFrame(watch);

    const done = () => {
      sendOut();
      L.style.display = "none";
      root.style.overflow = "";
      window.__issLoader = "done";
      window.dispatchEvent(new CustomEvent("iss:scroll-lock", { detail: false }));
      window.dispatchEvent(new Event("iss:loader-done"));
    };
    controls.then(done);

    // skip: click, tap or any key jumps straight to the exit
    const skip = () => {
      if (controls.time < OUT_AT) controls.time = OUT_AT;
      window.removeEventListener("keydown", skip);
    };
    L.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      L.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <div className="x-loader" ref={ref} aria-hidden="true">
      <div className="x-loader__sh">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <i key={i} />
        ))}
      </div>
      <div className="x-loader__c">
        <div className="x-loader__glow" />
        <div className="x-loader__stage">
          <svg className="x-loader__ring" viewBox="0 0 100 100" focusable="false">
            <defs>
              <linearGradient id="pl-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#756BFF" />
                <stop offset="1" stopColor="#00D9FF" />
              </linearGradient>
            </defs>
            <circle className="t" cx="50" cy="50" r="49" />
            <circle className="p" cx="50" cy="50" r="49" pathLength={100} />
          </svg>
          <div className="x-loader__orb x-loader__orb--a">
            <i />
            <i />
            <i />
          </div>
          <div className="x-loader__orb x-loader__orb--b">
            <i />
            <i />
            <i />
          </div>
          <div className="x-loader__cube">
            <div className="x-loader__halo" />
            <svg className="x-loader__f x-loader__f--t" viewBox="0 0 200 200" focusable="false">
              <defs>
                <linearGradient id="pl-top" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#7CF0FF" />
                  <stop offset="1" stopColor="#00D9FF" />
                </linearGradient>
              </defs>
              <path d="M100 18 172 59 100 100 28 59Z" fill="url(#pl-top)" />
              <path className="x-loader__s" d="M141.8 59.8 100 36 79.8 47.5 120.2 70.5 100 82 58.2 58.2" fill="none" stroke="#080B12" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="x-loader__f x-loader__f--l" viewBox="0 0 200 200" focusable="false">
              <defs>
                <linearGradient id="pl-lf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#8A82FF" />
                  <stop offset="1" stopColor="#5146E0" />
                </linearGradient>
              </defs>
              <path d="M28 59 100 100V182L28 141Z" fill="url(#pl-lf)" />
              <path className="x-loader__i" d="M64 100V143.5" fill="none" stroke="#F8FAFC" strokeWidth="10" strokeLinecap="round" />
            </svg>
            <svg className="x-loader__f x-loader__f--r" viewBox="0 0 200 200" focusable="false">
              <defs>
                <linearGradient id="pl-rt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3E9BFF" />
                  <stop offset="1" stopColor="#2A5BE0" />
                </linearGradient>
              </defs>
              <path d="M172 59V141L100 182V100Z" fill="url(#pl-rt)" />
              <path d="M172 59V141L100 182V100Z" fill="#000" fillOpacity=".12" />
            </svg>
            <svg className="x-loader__f x-loader__f--e" viewBox="0 0 200 200" focusable="false">
              <path d="M100 18 172 59V141L100 182 28 141V59Z M28 59 100 100 172 59 M100 100V182" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <div className="x-loader__sheen">
              <i />
            </div>
          </div>
        </div>
        <div className="x-loader__n">
          <span className="x-loader__d">
            <span>
              <b />
              <b>1</b>
            </span>
          </span>
          {[0, 1].map((k) => (
            <span className="x-loader__d" key={k}>
              <span>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
                  <b key={i}>{d}</b>
                ))}
              </span>
            </span>
          ))}
          <small>%</small>
        </div>
        <p className="x-loader__mark">
          {word.split("").map((c, i) => {
            const k = (i - ag) / 5;
            const style = i < ag ? undefined : { color: `rgb(${Math.round(117 - 117 * k)},${Math.round(107 + 110 * k)},255)` };
            return (
              <span key={i} style={style}>
                {c}
              </span>
            );
          })}
        </p>
        <p className="x-loader__st">
          <span>Designing…</span>
          <span>Developing…</span>
          <span>Launching…</span>
        </p>
      </div>
    </div>
  );
}
