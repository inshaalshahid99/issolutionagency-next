import { InlineScript } from "@/components/effects/InlineScript";
import { Preloader } from "@/components/effects/Preloader";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { RevealObserver } from "@/components/effects/RevealObserver";
import { CursorFX } from "@/components/effects/CursorFX";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ChatAssistantLoader } from "@/components/chat/ChatAssistantLoader";
import { JsonLd } from "@/components/seo/JsonLd";
import { bootScript } from "@/lib/boot-script";
import { organizationJsonLd } from "@/lib/seo";

/** Shared chrome for every agency page (also used by the 404 page). */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const aiEnabled = Boolean(process.env.OPENAI_API_KEY);
  return (
    <div className="page x-page" id="top">
      <InlineScript html={bootScript} />
      <noscript>
        <style>{`.x-reveal{opacity:1!important;transform:none!important}.x-loader{display:none!important}`}</style>
      </noscript>
      <a className="x-skip" href="#main">
        Skip to content
      </a>
      <div className="x-mesh" aria-hidden="true" />
      <div className="x-grain" aria-hidden="true" />
      <Preloader />
      <SiteHeader />
      <CursorFX />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <ChatAssistantLoader aiEnabled={aiEnabled} />
      <JsonLd data={organizationJsonLd()} />
      <SmoothScroll />
      <RevealObserver />
    </div>
  );
}
