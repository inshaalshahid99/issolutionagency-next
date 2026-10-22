"use client";

import { useEffect, useRef } from "react";
import { animate, scroll, stagger } from "motion/react";
import { hero } from "@/content/home";
import { isFinePointer, isLite } from "@/lib/motion-prefs";

const P4_OUT = [0.165, 0.84, 0.44, 1] as const;
const P3_OUT = [0.215, 0.61, 0.355, 1] as const;
const P3_INOUT = [0.645, 0.045, 0.355, 1] as const;
const P2_INOUT = [0.45, 0, 0.55, 1] as const;

const GLASS = [
  { cls: "x-glass--agent", depth: 40 },
  { cls: "x-glass--code", depth: 28 },
  { cls: "x-glass--chart", depth: 56 },
  { cls: "x-glass--sprint", depth: 22 },
];

const allWords = [...hero.rotatingWords, hero.rotatingWords[0]];
const fullHeadline = `${hero.headlineStart} ${hero.headlineJoin} ${hero.rotatingWords.map((w) => w.replace(/\.$/, "")).join(", ").replace(/, ([^,]*)$/, " and $1")}.`;

/** Wait for the preloader to start its exit (or resolve at once if there is none). */
function afterLoader(): Promise<number> {
  return new Promise((resolve) => {
    const s = window.__issLoader;
    if (s === "running") {
      const on = () => resolve(0.19);
      window.addEventListener("iss:loader-out", on, { once: true });
      window.setTimeout(() => resolve(0), 4500);
    } else resolve(0.1);
  });
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const heroEl = heroRef.current!;
    const root = document.documentElement;
    const anim = root.classList.contains("x-anim");
    const lite = isLite();
    const fine = isFinePointer();
    const cleanups: (() => void)[] = [];
    const $ = <T extends Element = HTMLElement>(s: string) => heroEl.querySelector<T>(s)!;
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(heroEl.querySelectorAll<T>(s));

    /* ---------- dot field canvas + spotlight (not in lite mode) ---------- */
    if (!lite) {
      const cv = $<HTMLCanvasElement>("#x-dots");
      const cx = cv.getContext("2d");
      if (cx) {
        let W = 0, H = 0, mx = -9999, my = -9999, live = true, raf = 0;
        const size = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          W = cv.offsetWidth;
          H = cv.offsetHeight;
          cv.width = W * dpr;
          cv.height = H * dpr;
          cx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const draw = (tms: number) => {
          const t = (tms || 0) / 1000;
          cx.clearRect(0, 0, W, H);
          const s = W < 768 ? 24 : 30, R = 170;
          for (let y = s / 2; y < H; y += s)
            for (let x = s / 2; x < W; x += s) {
              let px = x + Math.sin(t * 0.5 + y * 0.012) * 6;
              let py = y + Math.cos(t * 0.4 + x * 0.01) * 6;
              const dx = px - mx, dy = py - my, d = Math.sqrt(dx * dx + dy * dy);
              const f = d < R ? Math.pow(1 - d / R, 2) : 0;
              if (f) {
                px += (dx / (d || 1)) * f * 26;
                py += (dy / (d || 1)) * f * 26;
              }
              const k = x / W;
              cx.fillStyle = f ? `rgba(${Math.round(117 - 117 * k)},${Math.round(107 + 110 * k)},255,${0.25 + f * 0.75})` : "rgba(161,170,189,.16)";
              cx.beginPath();
              cx.arc(px, py, 1 + f * 2.2, 0, 6.283);
              cx.fill();
            }
        };
        const kick = () => {
          if (live && !document.hidden && !raf) raf = requestAnimationFrame(loop);
        };
        const loop = (t: number) => {
          raf = 0;
          draw(t);
          kick();
        };
        size();
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = cv.getBoundingClientRect();
          mx = e.clientX - r.left;
          my = e.clientY - r.top;
          heroEl.style.setProperty("--sx", mx + "px");
          heroEl.style.setProperty("--sy", my + "px");
          heroEl.classList.add("is-spot");
        };
        const onLeave = () => {
          mx = my = -9999;
          heroEl.classList.remove("is-spot");
        };
        const io = new IntersectionObserver((es) => {
          live = es[0].isIntersecting;
          kick();
        });
        io.observe(heroEl);
        window.addEventListener("resize", size);
        heroEl.addEventListener("pointermove", onMove);
        heroEl.addEventListener("pointerleave", onLeave);
        document.addEventListener("visibilitychange", kick);
        kick();
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          io.disconnect();
          window.removeEventListener("resize", size);
          heroEl.removeEventListener("pointermove", onMove);
          heroEl.removeEventListener("pointerleave", onLeave);
          document.removeEventListener("visibilitychange", kick);
        });
      }
    }

    if (!anim) {
      heroEl.classList.add("is-live");
      return () => cleanups.forEach((f) => f());
    }

    /* ---------- glass cards: one transform composed from intro, scroll and mouse ---------- */
    const glasses = $$(".x-glass");
    const state = glasses.map((g, i) => ({ el: g, depth: GLASS[i].depth, iy: 30, mx: 0, my: 0, rx: 0, ry: 0, sp: 0, dir: 1 }));
    let dirty = false;
    let rafG = 0;
    const render = () => {
      rafG = 0;
      dirty = false;
      state.forEach((s) => {
        const sx = s.dir * s.depth * 1.6 * s.sp;
        const sy = -s.depth * 3 * s.sp;
        s.el.style.transform = `translate(${sx}%, ${sy}%) perspective(800px) translate3d(${s.mx}px, ${s.my + s.iy}px, 0) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      });
    };
    const schedule = () => {
      if (!dirty) {
        dirty = true;
        rafG = requestAnimationFrame(render);
      }
    };
    const setDirs = () =>
      state.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        s.dir = r.left + r.width / 2 < innerWidth / 2 ? -1 : 1;
      });
    setDirs();
    render();
    cleanups.push(() => cancelAnimationFrame(rafG));

    /* ---------- rotating word ---------- */
    const last = $(".x-last");
    const box = $(".x-rot");
    const w = $(".x-rot__w");
    const em: Record<string, number> = {};
    let cur = allWords[0];
    const measure = () => {
      const fs = parseFloat(getComputedStyle(last).fontSize);
      let mx = 0;
      last.style.minWidth = "";
      box.style.width = "";
      allWords.forEach((t) => {
        w.textContent = t;
        em[t] = w.offsetWidth / fs;
        mx = Math.max(mx, em[t]);
      });
      w.textContent = cur;
      box.style.width = em[cur] + "em";
      last.style.minWidth = (last.offsetWidth - box.offsetWidth) / fs + mx + "em"; // reserve the widest word: no re-wrap
    };
    measure();
    document.fonts?.ready.then(measure);
    let rotStop = false;
    const rotate = async () => {
      let i = 1;
      while (!rotStop) {
        await new Promise((r) => setTimeout(r, 700));
        if (rotStop) return;
        const t = allWords[i];
        await animate(w, { y: "-100%", opacity: 0, filter: "blur(8px)" }, { duration: 0.35, ease: "easeIn" });
        if (rotStop) return;
        cur = t;
        w.textContent = t;
        animate(box, { width: em[t] + "em" }, { duration: 0.45, ease: P3_INOUT });
        await animate(w, { y: ["100%", "0%"], opacity: [0, 1], filter: ["blur(8px)", "blur(0px)"] }, { duration: 0.45, ease: P3_OUT });
        i = i + 1 >= allWords.length ? 1 : i + 1;
      }
    };
    cleanups.push(() => {
      rotStop = true;
    });

    /* ---------- intro (after the preloader) ---------- */
    const chars = $$("#x-h1 .x-c, #x-h1 .x-last");
    const fades = [$(".x-hero .x-eyebrow"), $(".x-hero__row"), $(".x-cue")];
    animate(chars, { y: "115%" }, { duration: 0 });
    animate(fades, { opacity: 0, y: 30 }, { duration: 0 });
    glasses.forEach((g) => (g.style.opacity = "0"));
    heroEl.classList.add("is-live");

    let cancelled = false;
    cleanups.push(() => {
      cancelled = true;
    });

    afterLoader().then((h0) => {
      if (cancelled) return;
      animate(chars, { y: "0%" }, { duration: 1.1, delay: stagger(0.016, { startDelay: h0 }), ease: P4_OUT });
      animate(fades[0], { opacity: 1, y: 0 }, { duration: 0.8, delay: h0, ease: P3_OUT });
      animate(fades[1], { opacity: 1, y: 0 }, { duration: 0.9, delay: h0 + 0.23, ease: P3_OUT });
      animate(fades[2], { opacity: 1, y: 0 }, { duration: 0.6, delay: h0 + 0.45 });
      glasses.forEach((g, i) => {
        animate(g, { opacity: 1 }, { duration: 1, delay: h0 + 0.28 + i * 0.1, ease: P3_OUT });
        animate(30, 0, {
          duration: 1,
          delay: h0 + 0.28 + i * 0.1,
          ease: P3_OUT,
          onUpdate: (v) => {
            state[i].iy = v;
            schedule();
          },
        });
      });
      window.setTimeout(() => !cancelled && story(), (h0 + 0.5) * 1000);
      window.setTimeout(() => !cancelled && rotate(), (h0 + 1.4) * 1000);
    });

    /* ---------- card story (~3s): typing, deploy, sprint, AI check ---------- */
    const pre = $(".x-glass--code pre");
    const nodes: [Text, string][] = [];
    let total = 0;
    const walk = (n: Node) => {
      if (n.nodeType === 3) {
        nodes.push([n as Text, n.textContent || ""]);
        total += (n.textContent || "").length;
        n.textContent = "";
      } else n.childNodes.forEach(walk);
    };
    walk(pre);
    const caret = document.createElement("i");
    caret.className = "x-caret";
    pre.appendChild(caret);
    cleanups.push(() => {
      nodes.forEach(([node, text]) => (node.textContent = text));
      caret.remove();
    });
    const dep = $(".x-glass--agent");
    const dl = $(".x-glass--agent b span");
    dep.classList.add("is-building");
    dl.textContent = "Building…";
    const sp = $(".x-glass--sprint");
    const sl = sp.querySelector("b span") as HTMLElement;
    const sk = sp.querySelector("b svg") as SVGElement;
    const meter = sp.querySelector(".x-meter i") as HTMLElement;
    animate(meter, { scaleX: 0 }, { duration: 0 });
    animate(sk, { scale: 0, opacity: 0 }, { duration: 0 });
    sl.textContent = "Build 1 of 4";
    const ai = $<SVGSVGElement>(".x-glass--chart b svg");
    const ap = ai.querySelector("path")!;
    const len = ap.getTotalLength();
    ap.style.strokeDasharray = String(len);
    ap.style.strokeDashoffset = String(len);

    function story() {
      animate(0, total, {
        duration: 1.4,
        ease: "linear",
        onUpdate: (v) => {
          let left = Math.round(v);
          nodes.forEach(([node, text]) => {
            const k = Math.max(0, Math.min(text.length, left));
            node.textContent = text.slice(0, k);
            left -= text.length;
          });
        },
      });
      window.setTimeout(() => {
        if (cancelled) return;
        dep.classList.remove("is-building");
        dl.textContent = "Build passing";
        animate(dep.querySelector("b")!, { scale: [0.82, 1] }, { duration: 0.5, ease: "backOut" });
      }, 1800);
      animate(meter, { scaleX: 1 }, { duration: 1.8, delay: 0.6, ease: P2_INOUT });
      animate(0, 1, {
        duration: 1.8,
        delay: 0.6,
        ease: P2_INOUT,
        onUpdate: (v) => {
          sl.textContent = `Build ${Math.min(4, 1 + Math.floor(v * 4))} of 4`;
        },
      });
      animate(sk, { scale: 1, opacity: 1 }, { duration: 0.4, delay: 2.45, ease: "backOut" });
      animate(ap, { strokeDashoffset: 0 }, { duration: 0.45, delay: 2.4, ease: "easeOut" });
      animate(ai, { boxShadow: ["0 0 0 0px rgba(0,217,255,.75)", "0 0 0 14px rgba(0,217,255,0)"] }, { duration: 0.9, delay: 2.8, ease: "easeOut" });
    }

    /* ---------- scroll-out + float parallax ---------- */
    const heroIn = $("#x-hero-in");
    cleanups.push(
      scroll(animate(heroIn, { scale: [1, 0.92], opacity: [1, 0.15], y: [0, -60], filter: ["blur(0px)", "blur(6px)"] }, { ease: "linear" }), {
        target: heroEl,
        offset: ["start start", "end start"],
      }),
    );
    const mq = window.matchMedia("(min-width: 768px)");
    let offScroll: (() => void) | null = null;
    let offMouse: (() => void) | null = null;
    const setup = () => {
      offScroll?.();
      offMouse?.();
      offScroll = offMouse = null;
      const floats = $(".x-floats");
      if (!mq.matches) {
        floats.style.opacity = "";
        state.forEach((s) => {
          s.sp = 0;
          s.mx = s.my = s.rx = s.ry = 0;
        });
        schedule();
        return;
      }
      setDirs();
      const a = scroll(animate(floats, { opacity: [1, 0] }, { ease: "linear" }), { target: heroEl, offset: ["start start", "end start"] });
      const b = scroll(
        (p: number) => {
          state.forEach((s) => (s.sp = p));
          schedule();
        },
        { target: heroEl, offset: ["start start", "end start"] },
      );
      offScroll = () => {
        a();
        b();
      };
      if (lite || !fine) return;
      const targets = state.map(() => ({ mx: 0, my: 0, rx: 0, ry: 0 }));
      let rafM = 0;
      const ease = () => {
        rafM = 0;
        let moving = false;
        state.forEach((s, i) => {
          const t = targets[i];
          (["mx", "my", "rx", "ry"] as const).forEach((k) => {
            const d = t[k] - s[k];
            if (Math.abs(d) > 0.01) {
              s[k] += d * 0.06;
              moving = true;
            } else s[k] = t[k];
          });
        });
        schedule();
        if (moving) rafM = requestAnimationFrame(ease);
      };
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || window.scrollY > innerHeight) return;
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        state.forEach((s, i) => {
          targets[i] = { mx: nx * -s.depth, my: ny * -s.depth, ry: (nx * s.depth) / 5, rx: (-ny * s.depth) / 5 };
        });
        if (!rafM) rafM = requestAnimationFrame(ease);
      };
      window.addEventListener("pointermove", move);
      offMouse = () => {
        window.removeEventListener("pointermove", move);
        cancelAnimationFrame(rafM);
      };
    };
    setup();
    mq.addEventListener("change", setup);
    cleanups.push(() => {
      mq.removeEventListener("change", setup);
      offScroll?.();
      offMouse?.();
    });

    return () => cleanups.forEach((f) => f());
  }, []);

  const startWords = `${hero.headlineStart}`.split(" ");

  return (
    <section className="x-hero" id="hero" ref={heroRef}>
      <canvas className="x-dots" id="x-dots" aria-hidden="true" />
      <div className="x-spot" aria-hidden="true" />
      <div className="x-wrap x-hero__in" id="x-hero-in">
        <p className="x-eyebrow">{hero.eyebrow}</p>
        <h1 id="x-h1" aria-label={fullHeadline}>
          <span aria-hidden="true">
            {startWords.map((word, wi) => (
              <span key={wi}>
                <span className="x-w">
                  {word.split("").map((c, ci) => (
                    <span className="x-c" key={ci}>
                      {c}
                    </span>
                  ))}
                </span>{" "}
              </span>
            ))}
            <span className="x-w">
              <span className="x-last" style={{ display: "inline-block" }}>
                {hero.headlineJoin}{" "}
                <span className="x-rot">
                  <em className="x-rot__w x-shine">{allWords[0]}</em>
                </span>
              </span>
            </span>
          </span>
        </h1>
        <div className="x-hero__row">
          <p className="x-lead">{hero.lead}</p>
          <div className="x-ctas">
            <a className="x-btn x-btn--grad x-mag" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="x-btn x-mag" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
      <div className="x-floats" aria-hidden="true">
        <div className="x-glass x-glass--agent">
          <small>Deploy · Production</small>
          <b>
            <i className="x-pulse" />
            <span>Build passing</span>
          </b>
        </div>
        <div className="x-glass x-glass--code">
          <pre>
            <span className="k">const</span>{" launch = "}<span className="k">await</span>{" build({\n  team: "}<span className="s">&quot;senior-led&quot;</span>{",\n  demos: "}<span className="s">&quot;weekly&quot;</span>{",\n});"}
          </pre>
        </div>
        <div className="x-glass x-glass--chart">
          <small>Schema · llms.txt</small>
          <b>
            <svg viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
            AI-search ready
          </b>
        </div>
        <div className="x-glass x-glass--sprint">
          <small>Sprint progress</small>
          <b>
            <span>Build 4 of 4</span>
            <svg className="x-sm" viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </b>
          <div className="x-meter">
            <i />
          </div>
        </div>
      </div>
      <a className="x-cue" href="#services">
        Scroll
        <i />
      </a>
    </section>
  );
}
