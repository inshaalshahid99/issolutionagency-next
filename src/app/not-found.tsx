import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="x-phero" style={{ minHeight: "70vh", display: "grid", alignItems: "center" }}>
        <div className="x-blob x-blob--a" style={{ top: -120, left: "20%", opacity: 0.25 }} />
        <div className="x-wrap" style={{ textAlign: "center" }}>
          <p className="x-eyebrow" style={{ justifyContent: "center" }}>
            Error 404
          </p>
          <p className="x-grad-text" aria-hidden="true" style={{ font: "600 clamp(120px, 24vw, 320px)/.85 var(--x-head)", letterSpacing: "-.06em", margin: "0 0 12px" }}>
            404
          </p>
          <h1 style={{ margin: "0 auto 20px", maxWidth: "none" }}>This page took a wrong turn.</h1>
          <p className="x-lead" style={{ margin: "0 auto 32px" }}>
            The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
          </p>
          <div className="x-ctas" style={{ justifyContent: "center" }}>
            <Link className="x-btn x-btn--grad x-mag" href="/">
              Back to home
            </Link>
            <Link className="x-btn x-mag" href="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
