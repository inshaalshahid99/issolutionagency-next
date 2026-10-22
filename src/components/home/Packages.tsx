"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, inView, stagger } from "motion/react";
import { chatbotAddon, defaultPackageIndex, formatUSD, packages, packagesNote } from "@/content/packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChatSvg, ClockSvg } from "@/components/ui/Icons";
import { prefillContact } from "@/lib/contact-prefill";

/**
 * Interactive packages selector (vertical tabs on desktop, pill bar on mobile).
 * "Get a quote" selects the package in the contact form and prefills the message.
 * `contactHref` is "#contact" on pages with the form, "/contact" elsewhere.
 */
export function Packages({ contactHref = "#contact" }: { contactHref?: string }) {
  const [cur, setCur] = useState(defaultPackageIndex);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const priceRefs = useRef<(HTMLElement | null)[]>([]);
  const prevCur = useRef(cur);
  const secRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  const isWide = () => window.matchMedia("(min-width: 1024px)").matches;

  const place = useCallback(() => {
    const t = tabRefs.current[cur];
    const bar = barRef.current;
    if (!t || !bar) return;
    if (isWide()) {
      bar.style.width = "2px";
      bar.style.height = t.offsetHeight + "px";
      bar.style.transform = `translate3d(0,${t.offsetTop}px,0)`;
    } else {
      bar.style.width = t.offsetWidth + "px";
      bar.style.height = t.offsetHeight + "px";
      bar.style.transform = `translate3d(${t.offsetLeft}px,${t.offsetTop}px,0)`;
    }
  }, [cur]);

  const reveal = useCallback((i: number, smooth: boolean) => {
    const list = listRef.current;
    const t = tabRefs.current[i];
    if (!list || !t || isWide()) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const x = t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, x), behavior: smooth && !reduce ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    place();
    const list = listRef.current!;
    const ro = new ResizeObserver(() => place());
    ro.observe(list);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [place]);

  useEffect(() => {
    reveal(cur, false);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // price roll between packages
  useEffect(() => {
    const from = packages[prevCur.current].price;
    prevCur.current = cur;
    const b = priceRefs.current[cur];
    const to = packages[cur].price;
    if (!b) return;
    if (from === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      b.textContent = formatUSD(to);
      return;
    }
    const a = animate(from, to, { duration: 0.7, ease: [0.215, 0.61, 0.355, 1], onUpdate: (v) => (b.textContent = formatUSD(v)) });
    return () => a.stop();
  }, [cur]);

  // entrance
  useEffect(() => {
    const sec = secRef.current!;
    if (!document.documentElement.classList.contains("x-anim")) return;
    const main = sec.querySelector<HTMLElement>(".x-pks__main")!;
    if (main.getBoundingClientRect().top < innerHeight * 0.85) return;
    const tabs = tabRefs.current.filter(Boolean) as HTMLElement[];
    const frame = sec.querySelector<HTMLElement>(".x-pks__frame")!;
    const aside = sec.querySelector<HTMLElement>(".x-pks__aside")!;
    const add = sec.querySelector<HTMLElement>(".x-pks__add")!;
    animate(tabs, { opacity: 0, y: 30 }, { duration: 0 });
    animate(frame, { opacity: 0, y: 50, scale: 0.97 }, { duration: 0 });
    animate(aside, { opacity: 0, x: 24 }, { duration: 0 });
    animate(add, { opacity: 0, y: 24 }, { duration: 0 });
    const ease = [0.215, 0.61, 0.355, 1] as const;
    const offs = [
      inView(sec.querySelector(".x-pks__hd")!, () => {
        animate(aside, { opacity: 1, x: 0 }, { duration: 0.9, ease });
      }, { margin: "0px 0px -15% 0px" }),
      inView(main, () => {
        animate(tabs, { opacity: 1, y: 0 }, { duration: 0.8, delay: stagger(0.07), ease });
        animate(frame, { opacity: 1, y: 0, scale: 1 }, { duration: 1.1, delay: 0.15, ease }).then(() => {
          frame.style.transform = "";
        });
      }, { margin: "0px 0px -15% 0px" }),
      inView(add, () => {
        animate(add, { opacity: 1, y: 0 }, { duration: 0.8, ease });
      }, { margin: "0px 0px -8% 0px" }),
    ];
    return () => offs.forEach((f) => f());
  }, []);

  const select = (i: number, focus = false) => {
    if (focus) tabRefs.current[i]?.focus({ preventScroll: true });
    if (i === cur) return;
    setCur(i);
    reveal(i, true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    const n = packages.length;
    let j: number | null = null;
    if (k === "ArrowDown" || k === "ArrowRight") j = (cur + 1) % n;
    else if (k === "ArrowUp" || k === "ArrowLeft") j = (cur - 1 + n) % n;
    else if (k === "Home") j = 0;
    else if (k === "End") j = n - 1;
    if (j === null) return;
    e.preventDefault();
    select(j, true);
  };

  const quote = (name: string) => prefillContact({ service: name, message: `Interested in the ${name} package.` });
  const addon = () => prefillContact({ service: "AI Chatbots & Automation", appendLine: chatbotAddon.message, serviceOnlyIfEmpty: true });
  const talk = (name: string) => window.dispatchEvent(new CustomEvent("iss:open-chat", { detail: { topic: name } }));

  return (
    <section className="x-sec x-pks" id="packages" ref={secRef}>
      <div className="x-blob x-blob--a" style={{ top: "35%", left: "auto", right: -220, opacity: 0.16 }} />
      <div className="x-wrap">
        <div className="x-pks__hd">
          <SectionHeading eyebrow="Packages" title="Clear scope. Clear starting price." />
          <p className="x-pks__aside">{packagesNote}</p>
        </div>
        <div className="x-pks__main" id="x-pks-main">
          <div
            className={`x-pks__list${ready ? " is-ready" : ""}`}
            id="x-pks-list"
            ref={listRef}
            role="tablist"
            aria-label="Packages"
            aria-orientation="vertical"
            onKeyDown={onKey}
          >
            <span className="x-pks__bar" ref={barRef} aria-hidden="true" />
            {packages.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className="x-pks__tab"
                type="button"
                role="tab"
                id={`pkt-${i + 1}`}
                aria-controls={`pkp-${i + 1}`}
                aria-selected={i === cur}
                tabIndex={i === cur ? 0 : -1}
                onClick={() => select(i)}
                onFocus={() => select(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches && isWide()) select(i);
                }}
              >
                <span className="x-pks__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="x-pks__name">{p.name}</span>
                <span className="x-pks__p">
                  {formatUSD(p.price)}
                  {p.unitShort && <small>{p.unitShort}</small>}
                </span>
              </button>
            ))}
          </div>
          <div className="x-pks__frame" id="x-pks-frame">
            <span className="x-pks__ring" aria-hidden="true" />
            <div className="x-pks__glass">
              {packages.map((p, i) => (
                <div key={p.id} className={`x-pks__pane${i === cur ? " is-on" : ""}`} role="tabpanel" id={`pkp-${i + 1}`} aria-labelledby={`pkt-${i + 1}`} inert={i !== cur}>
                  {p.tag && <span className="x-pks__tag">{p.tag}</span>}
                  <h3>{p.name}</h3>
                  <p className="x-pks__pitch">{p.pitch}</p>
                  <p className="x-pks__from">Starting from</p>
                  <p className="x-pks__price">
                    <b
                      ref={(el) => {
                        priceRefs.current[i] = el;
                      }}
                    >
                      {formatUSD(p.price)}
                    </b>
                    {p.unitLong && <small>{p.unitLong}</small>}
                  </p>
                  <ul className="x-pks__inc" aria-label="Included">
                    {p.includes.map((inc, k) => (
                      <li key={inc} style={{ "--i": k } as React.CSSProperties}>
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <p className="x-pks__time">
                    <ClockSvg />
                    {p.timeline}
                  </p>
                  <div className="x-pks__cta">
                    <a className="x-btn x-btn--grad x-mag" href={contactHref === "#contact" ? "#contact" : `${contactHref}?package=${p.id}`} onClick={() => quote(p.name)}>
                      Get a quote for {p.name}
                    </a>
                    <button className="x-pks__talk" type="button" onClick={() => talk(p.name)}>
                      <ChatSvg />
                      Talk it through
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="x-pks__add" id="x-pks-add">
          <span className="x-pks__spark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" />
              <path d="M19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" />
            </svg>
          </span>
          <p>
            <strong>{chatbotAddon.label}</strong> — from {formatUSD(chatbotAddon.price)}
          </p>
          <a className="x-more" href={contactHref === "#contact" ? "#contact" : `${contactHref}?addon=chatbot`} onClick={addon}>
            Add to quote
          </a>
        </div>
      </div>
    </section>
  );
}
