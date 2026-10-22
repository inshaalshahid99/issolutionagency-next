/**
 * Blog / Insights posts as typed content. Add a post by appending an object.
 * Body blocks: { type: "p" | "h2" | "h3", text } or { type: "ul" | "ol", items }.
 * `sample: true` shows a "Sample post" label (kept from the preview until the
 * owner reviews and publishes the copy).
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  sample: boolean;
  /** CSS background for the generated cover. */
  cover: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "scope-a-web-project-without-blowing-the-budget",
    title: "How to scope a web project without blowing the budget",
    excerpt: "Most overruns start before a line of code is written. Here is how to scope a site or app so cost and timeline stay predictable.",
    category: "Strategy",
    readMinutes: 6,
    date: "2026-10-01",
    sample: true,
    cover:
      "radial-gradient(60% 70% at 20% 25%, #756bff, transparent 70%), radial-gradient(55% 60% at 85% 80%, #00d9ff, transparent 70%), radial-gradient(40% 45% at 70% 20%, #c04bff, transparent 70%), #1b1640",
    body: [
      { type: "p", text: "Budgets rarely break because developers are slow. They break because the project quietly grows: a page here, an integration there, a “quick” feature nobody priced. Good scoping is how you stop that before it starts." },
      { type: "h2", text: "Start with outcomes, not pages" },
      { type: "p", text: "Write down what the project must achieve in plain terms: more enquiries, fewer support emails, a product people can sign up for. Every feature should trace back to one of those outcomes. If it doesn't, it's a candidate for later." },
      { type: "h2", text: "Separate must-haves from nice-to-haves" },
      { type: "p", text: "List every feature you can think of, then sort them into three groups:" },
      { type: "ul", items: ["Launch: the site or app doesn't work without it.", "Soon after: valuable, but launch can happen without it.", "Someday: ideas worth keeping, not worth paying for yet."] },
      { type: "p", text: "Only the first group belongs in the initial scope. This one exercise does more for your budget than any amount of negotiating on rates." },
      { type: "h2", text: "Be specific about content and integrations" },
      { type: "p", text: "Two things cause the most surprise costs: content that isn't ready and integrations that are harder than expected. Decide who writes the copy and supplies images, and list every system the project must connect to, such as payments, CRM, email or booking tools." },
      { type: "h2", text: "Agree milestones you can see" },
      { type: "p", text: "Break the work into milestones that produce something you can click: approved designs, a working staging site, content loaded, launch. Visible milestones make it obvious early if something is drifting." },
      { type: "h2", text: "Leave room for learning" },
      { type: "p", text: "You will learn things once real users see the work. Keep a small contingency, in time or budget, rather than pretending the plan is perfect. Changes then become decisions, not emergencies." },
      { type: "h3", text: "A simple checklist" },
      { type: "ol", items: ["Outcomes written down", "Features sorted into launch, soon and someday", "Content owner named", "Integrations listed", "Milestones agreed", "Contingency set aside"] },
      { type: "p", text: "If you'd like a second pair of eyes on a scope, send it over. We'll tell you honestly what we'd cut, keep or question." },
    ],
  },
  {
    slug: "core-web-vitals-what-actually-moves-the-needle",
    title: "Core Web Vitals: what actually moves the needle",
    excerpt: "LCP, INP and CLS explained in plain language, with the fixes that usually make the biggest difference.",
    category: "Performance",
    readMinutes: 5,
    date: "2026-10-08",
    sample: true,
    cover:
      "radial-gradient(55% 65% at 80% 20%, #00d9ff, transparent 70%), radial-gradient(60% 70% at 15% 85%, #756bff, transparent 70%), radial-gradient(35% 40% at 45% 50%, #3b82f6, transparent 70%), #0a1c2e",
    body: [
      { type: "p", text: "Core Web Vitals are Google's measures of how a page feels to real users. They influence search visibility, but the better reason to care is simpler: fast, stable pages are nicer to use." },
      { type: "h2", text: "The three metrics" },
      { type: "ul", items: ["Largest Contentful Paint (LCP): how quickly the main content appears. Aim for 2.5 seconds or less.", "Interaction to Next Paint (INP): how quickly the page responds when someone taps or clicks. Aim for 200 milliseconds or less.", "Cumulative Layout Shift (CLS): how much the layout jumps around while loading. Aim for 0.1 or less."] },
      { type: "h2", text: "Fixes that usually help LCP" },
      { type: "ul", items: ["Serve images in modern formats at the size they're displayed.", "Load the hero image early instead of lazy-loading it.", "Cut render-blocking scripts and unused CSS.", "Use good hosting with a CDN close to your visitors."] },
      { type: "h2", text: "Fixes that usually help INP" },
      { type: "ul", items: ["Ship less JavaScript, and load heavy features only when needed.", "Break long tasks into smaller chunks.", "Audit third-party scripts: chat widgets, trackers and tag managers are common culprits."] },
      { type: "h2", text: "Fixes that usually help CLS" },
      { type: "ul", items: ["Give images and embeds explicit width and height.", "Reserve space for banners and ads before they load.", "Load web fonts in a way that avoids big reflows."] },
      { type: "h2", text: "Measure real users, not just lab tests" },
      { type: "p", text: "Lab tools are great for debugging, but field data from real visitors is what counts. Check the Core Web Vitals report in Search Console and fix the pages with the most traffic first." },
      { type: "p", text: "Want to know where your site stands? Ask us for a free website audit and we'll send a prioritised list of fixes." },
    ],
  },
  {
    slug: "nextjs-vs-traditional-cms-choosing-the-right-stack",
    title: "Next.js vs. a traditional CMS: choosing the right stack",
    excerpt: "Both are great choices for different projects. Here is how to decide which one fits yours.",
    category: "Engineering",
    readMinutes: 7,
    date: "2026-10-15",
    sample: true,
    cover:
      "radial-gradient(50% 60% at 50% 15%, #8b5cf6, transparent 70%), radial-gradient(45% 55% at 15% 70%, #22d3ee, transparent 70%), radial-gradient(50% 55% at 90% 90%, #4f46e5, transparent 70%), #120f2a",
    body: [
      { type: "p", text: "“Should we use Next.js or WordPress?” is one of the most common questions we hear. There isn't a universal answer, but there is usually a clear answer for a given project." },
      { type: "h2", text: "When a traditional CMS is the right call" },
      { type: "ul", items: ["Your team publishes often and wants to edit pages visually.", "The site is mostly content: pages, posts and a few forms.", "You want a huge ecosystem of themes, plugins and people who know the platform.", "Budget favours a faster, simpler build."] },
      { type: "h2", text: "When Next.js shines" },
      { type: "ul", items: ["You need app-like features: accounts, dashboards, personalised content.", "Performance and Core Web Vitals are a top priority.", "You want full control over design and interaction, including rich animation.", "The site pulls data from several sources or APIs."] },
      { type: "h2", text: "The middle path: headless" },
      { type: "p", text: "A headless setup keeps a CMS for editing but uses a Next.js front end for speed and flexibility. Editors keep a familiar interface; visitors get a faster site. The trade-off is more moving parts to host and maintain." },
      { type: "h2", text: "Questions to ask before deciding" },
      { type: "ol", items: ["Who will edit the site, and how often?", "Which features must the site have at launch, and in a year?", "What does the team already know how to run?", "What is the budget for build and for ongoing care?"] },
      { type: "p", text: "We're stack-agnostic, so our recommendation follows your answers, not our preferences. Tell us about your project and we'll suggest the stack we'd pick, with reasons." },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[m - 1]} ${d}, ${y}`;
}
