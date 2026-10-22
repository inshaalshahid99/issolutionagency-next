# ISSolutionAgency — Website

Premium web development agency site built with **Next.js 16 (App Router)**, TypeScript, Tailwind CSS v4, Motion for React, GSAP + ScrollTrigger (lazy-loaded), React Hook Form + Zod, Resend and an OpenAI-compatible chat assistant.

## Quick start

Requires **Node.js 20.9+** (22 LTS recommended).

```bash
npm install
cp .env.example .env.local   # then fill in the keys (see below)
npm run dev                  # http://localhost:3000
```

| Script          | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Dev server with Turbopack            |
| `npm run build` | Production build (must pass clean)   |
| `npm run start` | Serve the production build           |
| `npm run lint`  | ESLint                               |
| `npx tsc --noEmit` | Type check                        |

## Environment variables

Set them in `.env.local` locally, and in **Vercel → Project → Settings → Environment Variables** for production.

| Key | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For the contact form | Resend API key |
| `CONTACT_TO_EMAIL` | For the contact form | Inbox that receives enquiries (comma-separate several) |
| `CONTACT_FROM_EMAIL` | For the contact form | Sender on a Resend-verified domain, e.g. `ISSolutionAgency <hello@yourdomain.com>` |
| `OPENAI_API_KEY` | Optional | Turns on the real AI project assistant |
| `OPENAI_MODEL` | Optional | Defaults to `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Optional | Any OpenAI-compatible endpoint |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Public URL (no trailing slash) for canonical links, sitemap, robots, Open Graph |

Behaviour without keys:
- **Contact form** returns HTTP 503 with a clear "not connected to email yet" message. It never pretends a message was sent.
- **Chat widget** runs its scripted demo flow and still offers "Talk to a human", which prefills the contact form.

## Where the content lives

All copy is typed data in `src/content/`, so edits never touch components.

| File | Contents |
| --- | --- |
| `site.ts` | Brand name, email, navigation, social links (placeholders until real ones exist) |
| `home.ts` | Hero (rotating words), tech strip, why-us, process, outcomes, FAQ, budgets, **testimonials** (`sample: true` = shown with a "Sample" label) |
| `packages.ts` | Pricing packages and the AI chatbot add-on. Also feeds the chat assistant's system prompt |
| `services.ts` | The 10 services and their detail pages (`/services/[slug]`) |
| `work.ts` | Portfolio items and case studies (`/work/[slug]`), currently the 3 labelled demo builds |
| `posts.ts` | Blog posts made of typed blocks (`/blog/[slug]`). Remove the sample flag once reviewed |
| `legal.ts` | Privacy policy and terms (starting points; have them reviewed) |
| `demos/*.ts` | Markup for the Ember & Bean and Lumea demos |

Adding a service, project or post = add an object to the array; routes, sitemap and metadata pick it up automatically.

Content rules: no fabricated reviews, statistics, clients or contact details. Anything not real stays clearly labelled.

## Project structure

```
src/
  app/            routes, layouts, API routes, sitemap, robots, OG image, manifest
  components/     sections, layout, effects (cursor, preloader, transitions), contact, chat, demos
  content/        all editable copy (see above)
  lib/            schemas, SEO helpers, GSAP loader, motion preferences, rate limit, chat prompt
  styles/         site.css (design system)
public/           logo, images, demo assets, llms.txt
```

Routes: `/`, `/services`, `/services/[slug]`, `/work`, `/work/[slug]`, `/about`, `/process`, `/blog`, `/blog/[slug]`, `/contact`, `/privacy`, `/terms`, `/demos/ember-and-bean`, `/demos/lumea`, `/demos/pulseboard`, `/api/contact`, `/api/chat`, plus a custom 404. Demo routes are `noindex` and excluded from the sitemap.

## Performance and accessibility notes

- Server Components by default; client code only for interactive parts.
- GSAP is dynamically imported only on sections that pin or scroll-scrub.
- Preloader runs once per session (sessionStorage), under 2s, and can be skipped.
- Custom cursor, magnetic buttons and the hero canvas switch off on touch devices, `prefers-reduced-motion`, Save-Data and low-power devices.
- Skip link, visible focus states, keyboard-accessible menu and accordion, 44px touch targets.

## Email setup (Resend)

1. Create an account at resend.com and add your domain under **Domains**.
2. Add the DNS records Resend shows (SPF, DKIM, optionally DMARC) at your DNS host and wait for "Verified".
3. Create an API key → `RESEND_API_KEY`.
4. Set `CONTACT_FROM_EMAIL` to an address on that domain and `CONTACT_TO_EMAIL` to your inbox.
5. Before the domain is verified you can test with `onboarding@resend.dev` as the sender; Resend then only delivers to your own Resend account email.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repo. Framework preset: Next.js (auto-detected). No build settings to change.
3. Add the environment variables from the table above.
4. Deploy. Every push to `main` redeploys; pull requests get preview URLs.

### Custom domain

1. Vercel → Project → **Settings → Domains** → add `yourdomain.com` and `www.yourdomain.com`.
2. At your registrar or DNS host, add the records Vercel shows (an `A` record for the apex, a `CNAME` for `www`). If the domain is on Cloudflare, set those records to **DNS only** (grey cloud).
3. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy so canonical links and the sitemap use it.

## Still to supply

- Real social profile links (`src/content/site.ts`)
- Real testimonials to replace the samples (`src/content/home.ts`)
- Review of the sample blog posts and the legal pages
- Final domain for `NEXT_PUBLIC_SITE_URL`
