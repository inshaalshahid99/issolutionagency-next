import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph image for every page. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(60% 70% at 85% 10%, rgba(117,107,255,.45), transparent 70%), radial-gradient(50% 60% at 10% 100%, rgba(0,217,255,.25), transparent 70%), #080B12",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 200 200">
            <path d="M100 18 172 59 100 100 28 59Z" fill="#3FE4FF" />
            <path d="M28 59 100 100V182L28 141Z" fill="#6D64F0" />
            <path d="M172 59V141L100 182V100Z" fill="#337BEF" />
            <path d="M141.8 59.8 100 36 79.8 47.5 120.2 70.5 100 82 58.2 58.2" fill="none" stroke="#080B12" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64 100V143.5" fill="none" stroke="#F8FAFC" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            ISSolution<span style={{ color: "#00D9FF" }}>Agency</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 980 }}>We build websites and web apps.</div>
          <div style={{ fontSize: 30, color: "#A1AABD", maxWidth: 900 }}>React · Next.js · WordPress · Shopify · Laravel. Fast, accessible and ready to scale.</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 260, borderRadius: 6, background: "linear-gradient(90deg, #756BFF, #00D9FF)" }} />
      </div>
    ),
    size,
  );
}
