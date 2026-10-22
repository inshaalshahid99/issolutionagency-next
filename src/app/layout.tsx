import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Fraunces, Geist_Mono, Inter, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { site } from "@/content/site";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400"], display: "swap" });
// Demo-build fonts (only downloaded on the /demos pages that use them).
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", preload: false });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap", preload: false });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", preload: false });
const fontVars = [spaceGrotesk, inter, geistMono, fraunces, dmSans, cormorant, jakarta].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#080B12",
  colorScheme: "dark",
};

/** Root layout: fonts only. Site chrome lives in (site)/layout.tsx; demos bring their own. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
