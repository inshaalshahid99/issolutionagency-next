/**
 * Global site content. Edit here; every page reads from this file.
 */

export const site = {
  name: "ISSolutionAgency",
  shortName: "ISS",
  tagline: "Web Development Agency",
  description:
    "ISSolutionAgency is a web development agency. Custom websites, web apps, e-commerce and APIs, built fast, accessible and ready to scale.",
  /** Public URL used for canonical links, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://issolutionagency.com").replace(/\/$/, ""),
  email: "inshaalshahid1@gmail.com",
  announcement: "Now booking new web projects — any scale.",
  replyTime: "We'll reply within one business day.",
  founded: 2026,
} as const;

export type NavItem = { label: string; href: string; hideBelowXl?: boolean };

/** Header links. "/#id" scrolls to a home section; plain paths are pages. */
export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Why us", href: "/#diff", hideBelowXl: true },
  { label: "Packages", href: "/#packages" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Full-screen mobile menu links (preview order). */
export const mobileNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/#packages" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const companyNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export type Social = { label: "LinkedIn" | "Instagram" | "X" | "GitHub" | "Dribbble"; href: string | null };

/**
 * Social profiles. These are placeholders until real profiles exist:
 * set `href` to a full URL and the icon becomes a link automatically.
 */
export const socials: Social[] = [
  { label: "LinkedIn", href: null },
  { label: "Instagram", href: null },
  { label: "X", href: null },
  { label: "GitHub", href: null },
  { label: "Dribbble", href: null },
];
