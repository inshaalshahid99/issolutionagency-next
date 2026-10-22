"use client";

import { prefillContact } from "@/lib/contact-prefill";

/** "Get a free website audit" preselects the audit service in the contact form. */
export function AuditButton({ href = "#contact" }: { href?: string }) {
  return (
    <a className="x-btn x-btn--grad x-mag" href={href} id="x-audit" onClick={() => prefillContact({ service: "Free audit" })}>
      Get a free website audit
    </a>
  );
}
