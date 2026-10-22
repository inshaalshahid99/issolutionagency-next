/**
 * The 10 services. `short` is the line shown on the home page list;
 * the rest feeds /services and /services/[slug].
 */

export type ServiceIcon =
  | "browser"
  | "grid"
  | "code"
  | "database"
  | "bag"
  | "doc"
  | "search"
  | "shield"
  | "chat"
  | "wrench";

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: ServiceIcon;
  /** Value used in the contact form "Service" select. */
  formValue: string;
  summary: string;
  forWho: string[];
  deliverables: string[];
  approach: { title: string; body: string }[];
  tools: string[];
  /** Package that usually fits, by package id. */
  packageId?: string;
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "custom-websites",
    title: "Custom Websites",
    short: "Marketing sites, landing pages and corporate sites, built from scratch.",
    icon: "browser",
    formValue: "Custom Websites",
    summary:
      "A site designed around your business and your visitors, not a recycled template. We plan the content, design every breakpoint and build it to load fast and rank well.",
    forWho: [
      "Businesses replacing an outdated or template-based site",
      "Startups that need a credible launch site quickly",
      "Teams running campaigns that need focused landing pages",
    ],
    deliverables: [
      "Sitemap, wireframes and responsive page designs",
      "Hand-built pages with considered animation",
      "Contact and enquiry forms wired to your inbox",
      "Metadata, schema markup and analytics at launch",
      "An editing setup you can use without a developer",
    ],
    approach: [
      { title: "Content first", body: "We map what each page must say and do before a pixel is designed." },
      { title: "Designed for every screen", body: "Layouts are designed and tested from small phones to wide desktops." },
      { title: "Built to be found", body: "Semantic markup, fast pages and structured data are in place on day one." },
    ],
    tools: ["Next.js", "React", "WordPress", "Tailwind CSS", "GSAP", "Figma"],
    packageId: "business-site",
    faqs: [
      { q: "Can you work with our existing brand?", a: "Yes. We work from your brand guidelines, or help tighten them if they are thin." },
      { q: "Will I be able to edit the site myself?", a: "Yes. We set up a CMS or editing workflow that suits your team and show you how to use it." },
    ],
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    short: "Dashboards, SaaS products and customer portals.",
    icon: "grid",
    formValue: "Web Applications",
    summary:
      "From a first MVP to a growing product, we design and build web apps with clean architecture, solid authentication and interfaces people enjoy using.",
    forWho: [
      "Founders validating a product idea with real users",
      "Companies replacing spreadsheets with a proper internal tool",
      "Teams that need a customer portal or dashboard",
    ],
    deliverables: [
      "Product scoping and user flows",
      "Authentication, roles and permissions",
      "Dashboards, data views and core features",
      "Automated deployment and environments",
      "Documentation and a clean handover",
    ],
    approach: [
      { title: "Scope the smallest useful version", body: "We agree what launch needs and what can wait, so you ship sooner." },
      { title: "Demos at every milestone", body: "You see working software regularly, not a big reveal at the end." },
      { title: "Architecture that grows", body: "Code is structured so new features don't mean rewrites." },
    ],
    tools: ["React", "Next.js", "TypeScript", "Redux", "Tailwind CSS", "Vercel"],
    packageId: "web-app-mvp",
    faqs: [
      { q: "Do you build the back end too?", a: "Yes. We handle the API, data layer and integrations alongside the interface." },
      { q: "Can you take over an app someone else started?", a: "Yes. We start with a code review so you know what is solid and what needs work." },
    ],
  },
  {
    slug: "front-end-development",
    title: "Front-End Development",
    short: "React and Next.js, including animation-rich UIs.",
    icon: "code",
    formValue: "Front-End Development",
    summary:
      "Pixel-accurate, accessible front ends built from your designs, with motion that feels polished and never gets in the way of performance.",
    forWho: [
      "Design teams that need a faithful build of their Figma files",
      "Product teams that need extra front-end capacity",
      "Brands that want a memorable, animation-rich experience",
    ],
    deliverables: [
      "Component libraries and design-system builds",
      "Responsive, accessible UI from your designs",
      "Scroll and interaction animation",
      "Performance budgets and Core Web Vitals tuning",
      "Clean, typed, documented components",
    ],
    approach: [
      { title: "Faithful to the design", body: "Spacing, type and motion match what was signed off." },
      { title: "Accessible by default", body: "Keyboard support, focus states and semantic HTML in every component." },
      { title: "Motion with restraint", body: "Animations respect reduced-motion settings and low-power devices." },
    ],
    tools: ["React", "Next.js", "TypeScript", "Sass", "Tailwind CSS", "GSAP", "Framer Motion", "Three.js", "Vite"],
    packageId: "landing-page",
    faqs: [
      { q: "Can you work inside our existing codebase?", a: "Yes. We follow your conventions, linting and review process." },
      { q: "Do you work from Figma?", a: "Yes, Figma is our standard hand-off format." },
    ],
  },
  {
    slug: "back-end-and-apis",
    title: "Back-End & APIs",
    short: "Secure APIs, databases and third-party integrations.",
    icon: "database",
    formValue: "Back-End & APIs",
    summary:
      "Reliable server logic, well-designed APIs and integrations with the services your business already runs on, built with security in mind from the start.",
    forWho: [
      "Products that need an API for web or mobile clients",
      "Businesses connecting payments, CRMs or other services",
      "Teams with a slow or fragile back end that needs attention",
    ],
    deliverables: [
      "API design and documentation",
      "Data modelling and migrations",
      "Payment, email and third-party integrations",
      "Authentication, validation and rate limiting",
      "Monitoring, logging and error alerts",
    ],
    approach: [
      { title: "Security first", body: "Input validation, least-privilege access and secrets kept out of code." },
      { title: "Documented contracts", body: "Every endpoint is documented so front ends and partners can rely on it." },
      { title: "Built to be observed", body: "Logs and alerts tell you about problems before your users do." },
    ],
    tools: ["TypeScript", "Next.js", "Git", "Vercel"],
    packageId: "web-app-mvp",
    faqs: [
      { q: "Can you integrate with a service we already pay for?", a: "Usually, yes. If it has an API or webhooks, we can connect it." },
      { q: "Do you help with hosting?", a: "Yes. We set up hosting and deployment, or work with your existing setup." },
    ],
  },
  {
    slug: "e-commerce",
    title: "E-commerce",
    short: "Shopify, WooCommerce and headless commerce stores.",
    icon: "bag",
    formValue: "E-commerce",
    summary:
      "Online stores that are easy to shop and easy to run: fast product pages, a smooth cart and checkout, and an admin your team is comfortable in.",
    forWho: [
      "Brands launching their first online store",
      "Stores moving to a faster or more flexible platform",
      "Retailers who need custom features their theme can't do",
    ],
    deliverables: [
      "Store setup or migration",
      "Custom theme design and build",
      "Product filtering, quick view and cart UX",
      "Payments, shipping and tax configuration",
      "Speed and conversion improvements",
    ],
    approach: [
      { title: "Shopper first", body: "Every step from product page to checkout is designed to reduce friction." },
      { title: "The right platform", body: "We recommend Shopify, WooCommerce or headless based on your catalogue and team." },
      { title: "Fast on mobile", body: "Most shoppers are on phones, so mobile speed gets priority." },
    ],
    tools: ["Shopify", "WordPress", "Next.js", "React", "Figma"],
    packageId: "business-site",
    faqs: [
      { q: "Can you migrate our products and customers?", a: "Yes. We plan the migration carefully, including redirects to protect your search rankings." },
      { q: "Which platform should we choose?", a: "It depends on catalogue size, budget and team. We give you an honest recommendation after discovery." },
    ],
  },
  {
    slug: "cms-and-wordpress",
    title: "CMS & WordPress",
    short: "Custom WordPress themes and headless CMS setups like Sanity.",
    icon: "doc",
    formValue: "CMS & WordPress",
    summary:
      "Content management your team will actually use: custom WordPress themes without page-builder bloat, or a headless CMS feeding a fast front end.",
    forWho: [
      "Content-heavy sites: publishers, blogs, resource hubs",
      "Teams stuck with a slow, plugin-heavy WordPress site",
      "Marketing teams that want to publish without a developer",
    ],
    deliverables: [
      "Custom WordPress theme development",
      "Headless CMS setup and content modelling",
      "Editor-friendly blocks and page templates",
      "Content migration from your old site",
      "Editor training and documentation",
    ],
    approach: [
      { title: "Model the content", body: "We structure content types around how your team writes and publishes." },
      { title: "Lean and fast", body: "Custom code instead of stacks of plugins keeps sites quick and secure." },
      { title: "Editor experience", body: "Editors get clear fields and previews, not a maze of options." },
    ],
    tools: ["WordPress", "Next.js", "React", "Sass", "Figma"],
    packageId: "business-site",
    faqs: [
      { q: "Can you speed up our existing WordPress site?", a: "Often, yes. We audit plugins, theme code and hosting to find the biggest wins." },
      { q: "Headless or traditional WordPress?", a: "Traditional is simpler to run; headless is faster and more flexible. We'll recommend one for your case." },
    ],
  },
  {
    slug: "performance-seo-accessibility",
    title: "Performance, SEO & Accessibility",
    short: "Core Web Vitals, technical SEO and WCAG accessibility.",
    icon: "search",
    formValue: "Performance, SEO & Accessibility",
    summary:
      "Faster pages, cleaner technical SEO and accessible interfaces, so more people can find, use and trust your site, including AI search engines.",
    forWho: [
      "Sites with poor Core Web Vitals or slow mobile pages",
      "Businesses losing search visibility after a redesign",
      "Organisations that need to meet WCAG accessibility standards",
    ],
    deliverables: [
      "Performance and Core Web Vitals audit with fixes",
      "Technical SEO: metadata, sitemaps, schema, redirects",
      "AI-search readiness: semantic markup and llms.txt",
      "WCAG 2.2 AA accessibility review and remediation",
      "A prioritised report you can act on",
    ],
    approach: [
      { title: "Measure first", body: "We benchmark before changing anything, so improvements are provable." },
      { title: "Fix what matters most", body: "Changes are prioritised by impact on users and rankings." },
      { title: "Ready for AI search", body: "Structured content helps ChatGPT, Perplexity and Google AI Overviews cite you." },
    ],
    tools: ["Next.js", "React", "WordPress", "Shopify", "Vercel"],
    packageId: "care-plan",
    faqs: [
      { q: "Can you guarantee rankings?", a: "No one honestly can. We fix the technical foundations that make good rankings possible." },
      { q: "What standard of accessibility do you work to?", a: "WCAG 2.2 level AA." },
    ],
  },
  {
    slug: "maintenance-and-support",
    title: "Maintenance & Support",
    short: "Updates, hosting, monitoring and migrations.",
    icon: "shield",
    formValue: "Maintenance & Support",
    summary:
      "Ongoing care after launch: updates, backups, monitoring and small improvements, so your site stays fast, secure and current.",
    forWho: [
      "Businesses without an in-house developer",
      "Sites that need regular updates and security patches",
      "Teams planning a hosting move or platform migration",
    ],
    deliverables: [
      "Core, plugin and dependency updates",
      "Backups and uptime monitoring",
      "Security patches and hardening",
      "Small edits and content changes",
      "Hosting setup and migrations",
    ],
    approach: [
      { title: "Proactive, not reactive", body: "Monitoring catches problems early instead of waiting for reports." },
      { title: "Plain reporting", body: "You get a clear summary of what was done and what's next." },
      { title: "One point of contact", body: "No ticket maze: you talk to the developers who know your site." },
    ],
    tools: ["WordPress", "Shopify", "Next.js", "Git", "Vercel"],
    packageId: "care-plan",
    faqs: [
      { q: "Do you maintain sites you didn't build?", a: "Yes, after a short onboarding review of the codebase and hosting." },
      { q: "Is there a minimum term?", a: "Care plans are monthly. We'll confirm terms in your proposal." },
    ],
  },
  {
    slug: "ai-chatbots-and-automation",
    title: "AI Chatbots & Automation",
    short:
      "Website and WhatsApp chatbots trained on your content, booking bots, and form-to-CRM workflows with n8n, Make or Zapier.",
    icon: "chat",
    formValue: "AI Chatbots & Automation",
    summary:
      "Chatbots that answer from your own content and hand off to a human when they should, plus automations that move leads and data between your tools without copy-paste.",
    forWho: [
      "Businesses answering the same questions every day",
      "Service businesses that take bookings or enquiries",
      "Teams copying form submissions into a CRM by hand",
    ],
    deliverables: [
      "Website or WhatsApp chatbot trained on your content",
      "Booking and lead-capture flows",
      "Human handoff and conversation logs",
      "Form-to-CRM and notification workflows",
      "Testing, guardrails and documentation",
    ],
    approach: [
      { title: "Grounded answers", body: "Bots answer from your approved content and say so when they don't know." },
      { title: "Always a human route", body: "Every bot offers a clear way to reach a real person." },
      { title: "Automate the boring parts", body: "We connect your tools so data moves itself, reliably." },
    ],
    tools: ["n8n", "Make", "Zapier", "Next.js", "React"],
    packageId: "business-site",
    faqs: [
      { q: "Can a chatbot be added to any of your packages?", a: "Yes. The AI chatbot add-on starts from $300." },
      { q: "Will the bot make things up?", a: "We ground it in your content, add guardrails and test it, and it hands off to a human when unsure." },
    ],
  },
  {
    slug: "ai-app-rescue",
    title: "AI-App Rescue",
    short: "Fix, secure and scale apps built with Lovable, Bolt, v0 or Cursor.",
    icon: "wrench",
    formValue: "AI-App Rescue",
    summary:
      "Built something with an AI app builder and hit a wall? We review the code, fix what's broken, close security gaps and get it ready for real users.",
    forWho: [
      "Founders whose AI-built prototype stopped making progress",
      "Apps with bugs, slow pages or security worries",
      "Products that need payments, auth or deployment done properly",
    ],
    deliverables: [
      "Code and security review with a clear report",
      "Bug fixes and stability work",
      "Authentication, payments and data security",
      "Performance improvements",
      "Proper deployment and environments",
    ],
    approach: [
      { title: "Keep what works", body: "We don't start over unless it's genuinely cheaper for you." },
      { title: "One-week sprints", body: "Fixed-price sprints with a clear goal and a demo at the end." },
      { title: "Senior review", body: "Every change is reviewed by a senior developer before it ships." },
    ],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git", "Vercel"],
    packageId: "ai-app-rescue",
    faqs: [
      { q: "Which AI builders do you work with?", a: "Apps from Lovable, Bolt, v0, Cursor and similar tools, as long as we can access the code." },
      { q: "How is a rescue priced?", a: "In one-week sprints, from $600 per week. We scope the first sprint after a quick review." },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** Service options for the contact form, in preview order. */
export const serviceFormOptions = ["Free audit", ...services.map((s) => s.formValue)];
