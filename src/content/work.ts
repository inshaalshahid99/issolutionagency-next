/**
 * Work / portfolio. All three entries are DEMO BUILDS made by ISSolutionAgency
 * to show capability. They are not client projects and must stay labelled.
 */

export type WorkFilter = "websites" | "webapps" | "ecommerce" | "cms";

export const workFilters: { id: "all" | WorkFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "websites", label: "Websites" },
  { id: "webapps", label: "Web Apps" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "cms", label: "CMS" },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  filters: WorkFilter[];
  description: string;
  tags: string[];
  /** Route of the live demo inside this app. */
  demoHref: string;
  /** Fake address shown in the mock browser bar. */
  mockUrl: string;
  mock: "cafe" | "skin" | "dash";
  mockBg: string;
  image?: { src: string; alt: string };
  caseStudy: {
    brief: string;
    goals: string[];
    approach: { title: string; body: string }[];
    features: string[];
    stack: string[];
    note: string;
  };
};

export const projects: Project[] = [
  {
    slug: "ember-and-bean",
    title: "Ember & Bean",
    category: "Website",
    filters: ["websites", "cms"],
    description: "Warm editorial café site with a tabbed menu, journal and visit info.",
    tags: ["WordPress", "Custom theme", "Responsive"],
    demoHref: "/demos/ember-and-bean",
    mockUrl: "emberandbean.demo",
    mock: "cafe",
    mockBg: "linear-gradient(150deg,#3a2416,#8a5a3a 55%,#0d1220)",
    image: { src: "/images/work/cafe-hero.jpg", alt: "Ember & Bean café interior at golden hour" },
    caseStudy: {
      brief:
        "A concept site for a fictional specialty café: warm, editorial and easy to use on a phone in a queue. Built as a WordPress custom-theme concept.",
      goals: [
        "Make the menu the hero: quick to scan, grouped by category",
        "Give regulars a reason to return with a journal",
        "Answer “when are you open and where are you?” in one glance",
      ],
      approach: [
        { title: "Editorial type, warm palette", body: "A serif display face, cream paper tones and terracotta accents set a slow-coffee mood." },
        { title: "Accessible tabbed menu", body: "Coffee, tea and bakery tabs with full keyboard support and dotted price leaders." },
        { title: "Visit info that adapts", body: "Opening hours highlight today automatically, next to the address and a map." },
      ],
      features: [
        "Tabbed menu with keyboard navigation",
        "Journal cards with categories and dates",
        "Today's opening hours highlighted",
        "Validated newsletter form (demo only)",
        "Sticky header and mobile menu",
      ],
      stack: ["WordPress (theme concept)", "HTML5", "CSS3", "JavaScript"],
      note: "Demo build: Ember & Bean is a fictional café created by ISSolutionAgency to show what we build. No real client, figures or results.",
    },
  },
  {
    slug: "lumea",
    title: "Lumea",
    category: "E-commerce",
    filters: ["ecommerce"],
    description: "Shopify-style skincare store with filters, quick view and a slide-out cart.",
    tags: ["Shopify", "Liquid-style theme", "Cart UX"],
    demoHref: "/demos/lumea",
    mockUrl: "lumea.demo",
    mock: "skin",
    mockBg: "linear-gradient(150deg,#e9dccb,#9c8a7a 50%,#0d1220)",
    image: { src: "/images/work/skin-hero.jpg", alt: "Lumea skincare bottles on warm stone" },
    caseStudy: {
      brief:
        "A concept storefront for a fictional four-product skincare brand, designed like a premium Shopify theme with a frictionless path from browsing to bag.",
      goals: [
        "Keep the catalogue calm and premium, not cluttered",
        "Let shoppers filter and preview without leaving the page",
        "Make the bag easy to review and edit",
      ],
      approach: [
        { title: "Quiet luxury styling", body: "Generous whitespace, soft neutrals and large product photography." },
        { title: "Shop without page loads", body: "Category filters, quick view and add to bag all happen in place." },
        { title: "Slide-out cart", body: "An accessible drawer with quantity controls and a running subtotal." },
      ],
      features: [
        "Category filter chips",
        "Product quick view dialog",
        "Slide-out bag with quantities and subtotal",
        "Search panel",
        "Responsive product grid",
      ],
      stack: ["Shopify (Liquid-style theme concept)", "HTML5", "CSS3", "JavaScript"],
      note: "Demo build: Lumea is a fictional brand created by ISSolutionAgency. Products, prices and checkout are not real.",
    },
  },
  {
    slug: "pulseboard",
    title: "Pulseboard",
    category: "Web App",
    filters: ["webapps"],
    description: "React product-analytics site with a live, interactive dashboard.",
    tags: ["React 18", "Hooks", "SVG charts"],
    demoHref: "/demos/pulseboard",
    mockUrl: "pulseboard.demo",
    mock: "dash",
    mockBg: "linear-gradient(150deg,#3b5bfd,#1b2a7a 55%,#0d1220)",
    caseStudy: {
      brief:
        "A concept marketing site and live dashboard for a fictional product-analytics SaaS, built in React to show interactive data UI.",
      goals: [
        "Show the product working, not just screenshots",
        "Make numbers readable in seconds",
        "Keep the dashboard responsive and accessible",
      ],
      approach: [
        { title: "A real React dashboard", body: "KPIs, a hoverable chart, a live activity feed and a searchable users table." },
        { title: "Hand-built SVG charts", body: "No chart library: lightweight SVG with tooltips and accessible labels." },
        { title: "Generated sample data", body: "Seeded data changes with the date range so the UI feels alive." },
      ],
      features: [
        "Animated KPI counters",
        "Interactive line chart with tooltips",
        "Live activity feed",
        "Searchable users table",
        "Pricing toggle and FAQ",
      ],
      stack: ["React", "TypeScript", "SVG", "CSS3"],
      note: "Demo build: Pulseboard is a fictional product created by ISSolutionAgency. All data is generated sample data.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
