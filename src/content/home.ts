/**
 * Home page copy (hero, differentiation, why us, process, stack, outcomes,
 * testimonials, FAQ). Ported verbatim from the approved preview.
 */

export const hero = {
  eyebrow: "Web development agency",
  headlineStart: "We build websites and web apps",
  headlineJoin: "on",
  /** Rotating words, looped in the violet-to-cyan gradient. */
  rotatingWords: ["React.", "Next.js.", "WordPress.", "Shopify.", "Laravel."],
  lead: "Custom websites, web applications, e-commerce and APIs, in React, Next.js, TypeScript, Tailwind, GSAP, WordPress, Shopify and more. Built fast, accessible and ready to scale.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "See our work", href: "#work" },
};

export const differentiation = {
  eyebrow: "Why we're different",
  title: "Not another agency template.",
  rows: [
    { old: "One stack for every client.", title: "Honest tech advice", body: "We pick the right tool for your project, not the one we happen to sell." },
    { old: "“Start over from scratch.”", title: "We finish what AI started", body: "Built something with Lovable, Bolt, v0 or Cursor and got stuck? We fix, secure and scale it into a real product." },
    { old: "SEO only for classic Google.", title: "Ready for AI search", body: "Semantic markup, schema, speed and llms.txt so ChatGPT, Perplexity and Google AI Overviews can find and cite you." },
    { old: "Slow handoffs or unreviewed AI code.", title: "AI speed, human quality", body: "AI helps us move faster; a senior developer reviews every line before it ships." },
    { old: "Vague quotes and open-ended hours.", title: "Fixed scope, clear price", body: "Productized packages and one-week Fix Sprints, so you know cost and timeline upfront." },
    { old: "Locked into their platform.", title: "You own everything", body: "Clean, documented code, your repo, your hosting. No lock-in." },
  ],
};

export const whyUs = {
  eyebrow: "Why us",
  title: "A partner, not a vendor",
  items: [
    { title: "Stack-agnostic", body: "We pick the right tool for your project, not our favourite." },
    { title: "Code you own", body: "Clean, maintainable, documented code that belongs to you." },
    { title: "Fast and accessible by default", body: "Performance and accessibility built in from the first commit." },
    { title: "Clear milestones", body: "Plain communication and fixed milestones, so you always know where things stand." },
  ],
};

export const processSteps = [
  { title: "Discover", body: "Your goals, users, content and existing systems." },
  { title: "Plan & Architect", body: "Scope, sitemap, the right stack and fixed milestones." },
  { title: "Design", body: "Wireframes and responsive page designs you sign off." },
  { title: "Develop", body: "Front end, back end and CMS, shown at every milestone." },
  { title: "Test & Launch", body: "Cross-browser, performance and accessibility checks, then go live." },
  { title: "Support & Grow", body: "Updates, monitoring and new features as you grow." },
];

/** Exactly these 18, in this order (two marquee rows of 9). */
export const techStack = [
  "HTML5", "CSS3", "Sass", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "GSAP",
  "Framer Motion", "Three.js", "Redux", "Vite", "Figma", "Git", "WordPress", "Shopify", "Vercel",
];

export const outcomes = {
  eyebrow: "Outcomes",
  title: "What you get",
  items: [
    { icon: "bolt", title: "Faster load times", body: "Lean builds that load quickly on any device and connection." },
    { icon: "search", title: "Search-ready from day one", body: "Clean markup, metadata and technical SEO in place at launch." },
    { icon: "target", title: "More qualified leads", body: "Sites built to turn visitors into enquiries and customers." },
    { icon: "bars", title: "Products that scale", body: "Web apps architected for more users, traffic and features." },
  ] as const,
  note: "Verified results will be published here as case studies launch.",
};

/**
 * SAMPLE testimonials. These are placeholders, not real client quotes.
 * Keep `sample: true` (shows the "Sample testimonial" label) until real ones arrive.
 */
export const testimonials = [
  { quote: "Communication was clear from day one. We always knew what was happening and why.", name: "Client Name", role: "Role, Company", sample: true },
  { quote: "The quality of the design and code exceeded what we expected. It just works.", name: "Client Name", role: "Role, Company", sample: true },
  { quote: "Every milestone landed on time, and launch day was calm.", name: "Client Name", role: "Role, Company", sample: true },
];

export const faqs = [
  { q: "Which tech stack do you use?", a: "We choose the stack per project, from React and Next.js to Laravel, WordPress or Shopify, or we work in the one you already have." },
  { q: "Can you work on an existing site or codebase?", a: "Yes. We can audit, fix, extend or migrate what you already have." },
  { q: "How long does a website take?", a: "A marketing site takes 3 to 6 weeks; a custom web app 2 to 6 months. We set the timeline after discovery." },
  { q: "Do you do e-commerce?", a: "Yes: Shopify, WooCommerce and headless commerce stores." },
  { q: "Will I own the code?", a: "Yes, in full, once the project is paid." },
  { q: "Do you offer hosting and maintenance?", a: "Yes: hosting, updates, monitoring and migrations after launch." },
  { q: "Do you use AI?", a: "Yes, to move faster on research, scaffolding and testing. A developer reviews every line before it ships, and you own all the code." },
];

export const contactCopy = {
  kicker: "Have a web project in mind?",
  headline: "Let's build it.",
  intro: "Tell us about your goals and we'll reply within one business day.",
};

export const budgetOptions = ["Under $5k", "$5k to $15k", "$15k to $50k", "$50k+", "Not sure yet"];
