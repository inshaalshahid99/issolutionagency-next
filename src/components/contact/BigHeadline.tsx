"use client";

import { useEffect, useRef } from "react";
import { animate, scroll } from "motion/react";

/** "Let's build it." headline that scales up as it scrolls into view. */
export function BigHeadline({ kicker, headline, as: Tag = "h2" }: { kicker: string; headline: string; as?: "h1" | "h2" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("x-anim")) return;
    return scroll(animate(el, { scale: [0.8, 1] }, { ease: "linear" }), { target: el, offset: ["start end", "center 0.45"] });
  }, []);
  return (
    <Tag className="x-big" id="x-big" ref={ref}>
      <small>{kicker}</small>
      <span className="x-grad-text">{headline}</span>
    </Tag>
  );
}
