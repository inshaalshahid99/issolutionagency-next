/**
 * Productized packages. Prices are starting points; final price depends on scope.
 * These figures also feed the AI assistant's system prompt (src/lib/chat-prompt.ts).
 */

export type Package = {
  id: string;
  name: string;
  /** Numeric starting price in USD, used for the price roll animation. */
  price: number;
  /** Suffix after the price in the list ("/wk") and in the panel ("/ week"). */
  unitShort?: string;
  unitLong?: string;
  pitch: string;
  includes: string[];
  timeline: string;
  tag?: string;
};

export const packages: Package[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    price: 200,
    pitch: "One sharp page that turns visitors into enquiries.",
    includes: ["1 animated page", "Responsive", "SEO + AI-search ready", "Contact form"],
    timeline: "2 days",
  },
  {
    id: "business-site",
    name: "Business Site",
    price: 1200,
    pitch: "A complete site you can update yourself.",
    includes: ["Up to 8 pages", "CMS", "Blog", "Schema markup", "Analytics"],
    timeline: "3–5 weeks",
    tag: "Recommended start",
  },
  {
    id: "web-app-mvp",
    name: "Web App MVP",
    price: 3500,
    pitch: "Your product idea, live and in users' hands.",
    includes: ["Auth", "Dashboard", "Database", "Core features", "Deployment"],
    timeline: "6–10 weeks",
  },
  {
    id: "ai-app-rescue",
    name: "AI-App Rescue Sprint",
    price: 600,
    unitShort: "/wk",
    unitLong: "/ week",
    pitch: "Built it with AI and got stuck? We get it shipping.",
    includes: ["Fix bugs", "Security", "Payments", "Speed", "Deployment"],
    timeline: "1-week sprints",
  },
  {
    id: "care-plan",
    name: "Care Plan",
    price: 120,
    unitShort: "/mo",
    unitLong: "/ month",
    pitch: "We keep your site fast, safe and up to date.",
    includes: ["Updates", "Backups", "Monitoring", "Small edits"],
    timeline: "Monthly",
  },
];

/** Index of the package selected by default (Business Site). */
export const defaultPackageIndex = 1;

export const chatbotAddon = {
  label: "AI chatbot for any package",
  price: 300,
  message: "I'd like to add the AI chatbot add-on (from $300).",
};

export const packagesNote = "Every quote is free. Final price depends on scope.";

export function formatUSD(v: number) {
  return "$" + Math.round(v).toLocaleString("en-US");
}

export function getPackage(id: string) {
  return packages.find((p) => p.id === id);
}
