import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the prism cube on the brand background. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#080B12" }}>
        <svg width="132" height="132" viewBox="0 0 200 200">
          <path d="M100 18 172 59 100 100 28 59Z" fill="#3FE4FF" />
          <path d="M28 59 100 100V182L28 141Z" fill="#6D64F0" />
          <path d="M172 59V141L100 182V100Z" fill="#337BEF" />
          <path d="M141.8 59.8 100 36 79.8 47.5 120.2 70.5 100 82 58.2 58.2" fill="none" stroke="#080B12" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M64 100V143.5" fill="none" stroke="#F8FAFC" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
