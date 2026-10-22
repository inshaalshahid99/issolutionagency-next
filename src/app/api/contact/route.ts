import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * POST /api/contact — validates the enquiry and emails it via Resend.
 * Env: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL (a sender on a domain verified in Resend).
 * Never reports success unless Resend accepted the email.
 */
export async function POST(req: Request) {
  const rl = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return Response.json({ ok: false, error: `Too many messages from your connection. Please try again in a few minutes or email ${site.email}.` }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots that fill the hidden field get a generic rejection.
  if (raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).website === "string" && (raw as Record<string, string>).website.trim() !== "") {
    return Response.json({ ok: false, error: "Your message could not be sent." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check the form and try again." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
    return Response.json(
      { ok: false, error: `The contact form isn't connected to email yet, so your message was not sent. Please email us directly at ${site.email}.` },
      { status: 503 },
    );
  }

  const d = parsed.data;
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "—"],
    ["Service", d.service],
    ["Budget", d.budget],
  ];
  const text = `New enquiry from the website\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${d.message}\n`;
  const html = `<h2 style="font-family:sans-serif">New enquiry from the website</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${esc(d.message)}</p>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: d.email,
      subject: `New enquiry: ${d.service} — ${d.name}`,
      text,
      html,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return Response.json({ ok: false, error: `We couldn't send your message right now. Please try again shortly or email ${site.email}.` }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json({ ok: false, error: `We couldn't send your message right now. Please try again shortly or email ${site.email}.` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
