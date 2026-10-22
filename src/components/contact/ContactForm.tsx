"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { subscribePrefill } from "@/lib/contact-prefill";
import { serviceFormOptions, services } from "@/content/services";
import { chatbotAddon, getPackage, packages } from "@/content/packages";
import { budgetOptions } from "@/content/home";
import { site } from "@/content/site";

type Status = { kind: "idle" } | { kind: "ok"; text: string } | { kind: "err"; text: string };

/**
 * Project enquiry form: React Hook Form + Zod, posts to /api/contact (Resend).
 * Real loading / success / error states; never pretends to succeed.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const lastAuto = useRef("");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", company: "", service: "", budget: "", message: "", website: "" },
  });

  // prefill from buttons on the page and from ?package= / ?service= / ?addon= links
  useEffect(() => {
    const apply = (p: Parameters<Parameters<typeof subscribePrefill>[0]>[0]) => {
      const opts = { shouldValidate: false, shouldDirty: true } as const;
      if (p.name) setValue("name", p.name, opts);
      if (p.email) setValue("email", p.email, opts);
      if (p.service && (!p.serviceOnlyIfEmpty || !getValues("service"))) setValue("service", p.service, opts);
      const msg = getValues("message");
      if (p.message !== undefined && (!msg.trim() || msg === lastAuto.current)) {
        setValue("message", p.message, opts);
        lastAuto.current = p.message;
      }
      if (p.appendLine) {
        const cur = getValues("message");
        if (!cur.includes(p.appendLine)) {
          const v = cur.trim();
          const next = v ? `${v}\n${p.appendLine}` : p.appendLine;
          setValue("message", next, opts);
          if (!v || v === lastAuto.current) lastAuto.current = next;
        }
      }
      setStatus({ kind: "idle" });
      if (p.focus) window.setTimeout(() => setFocus(p.focus!), 900);
    };
    const qs = new URLSearchParams(window.location.search);
    const pkg = qs.get("package");
    const svc = qs.get("service");
    if (pkg) {
      const found = getPackage(pkg);
      if (found) apply({ service: found.name, message: `Interested in the ${found.name} package.` });
    }
    if (svc) {
      const found = services.find((s) => s.slug === svc);
      if (found) apply({ service: found.formValue });
      else if (svc === "audit") apply({ service: "Free audit" });
    }
    if (qs.get("addon") === "chatbot") apply({ service: "AI Chatbots & Automation", serviceOnlyIfEmpty: true, appendLine: chatbotAddon.message });
    return subscribePrefill(apply);
  }, [getValues, setFocus, setValue]);

  const onSubmit = async (data: ContactInput) => {
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus({ kind: "err", text: json.error || `Something went wrong (error ${res.status}). Please email us at ${site.email}.` });
        return;
      }
      reset();
      lastAuto.current = "";
      setStatus({ kind: "ok", text: `Thanks, ${data.name.split(" ")[0]}. Your message is on its way. ${site.replyTime}` });
    } catch {
      setStatus({ kind: "err", text: `We couldn't reach the server. Check your connection and try again, or email ${site.email}.` });
    }
  };

  const field = (name: keyof ContactInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
  });

  return (
    <form className="x-form" id="x-form" noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)} aria-busy={isSubmitting}>
      <div className="x-field">
        <div className="x-fl__box">
          <input id="f-name" autoComplete="name" placeholder=" " {...register("name")} {...field("name")} />
          <label htmlFor="f-name">Name</label>
          <i />
        </div>
        <span className="x-err" id="e-name">
          {errors.name?.message}
        </span>
      </div>
      <div className="x-field">
        <div className="x-fl__box">
          <input id="f-email" type="email" autoComplete="email" placeholder=" " {...register("email")} {...field("email")} />
          <label htmlFor="f-email">Email</label>
          <i />
        </div>
        <span className="x-err" id="e-email">
          {errors.email?.message}
        </span>
      </div>
      <div className="x-field">
        <div className="x-fl__box">
          <input id="f-company" autoComplete="organization" placeholder=" " {...register("company")} />
          <label htmlFor="f-company">
            Company <small>(optional)</small>
          </label>
          <i />
        </div>
      </div>
      <div className="x-field">
        <div className="x-fl__box">
          <select id="f-service" {...register("service")} {...field("service")}>
            <option value="">Choose a service</option>
            {serviceFormOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
            <optgroup label="Packages">
              {packages.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          </select>
          <label htmlFor="f-service">Service</label>
          <i />
        </div>
        <span className="x-err" id="e-service">
          {errors.service?.message}
        </span>
      </div>
      <div className="x-field x-field--full">
        <div className="x-fl__box">
          <select id="f-budget" {...register("budget")} {...field("budget")}>
            <option value="">Choose a range</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <label htmlFor="f-budget">Budget</label>
          <i />
        </div>
        <span className="x-err" id="e-budget">
          {errors.budget?.message}
        </span>
      </div>
      <div className="x-field x-field--full">
        <div className="x-fl__box">
          <textarea id="f-message" placeholder=" " {...register("message")} {...field("message")} />
          <label htmlFor="f-message">Message</label>
          <i />
        </div>
        <span className="x-err" id="e-message">
          {errors.message?.message}
        </span>
      </div>
      {/* honeypot: hidden from people and assistive tech */}
      <div className="x-hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <div className="x-field--full">
        <button className={`x-btn x-btn--grad x-mag x-send${isSubmitting ? " is-busy" : ""}`} id="x-send" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          <span className="x-send__t">{isSubmitting ? "Sending…" : "Send message"}</span>
          <span className="x-spin" aria-hidden="true" />
        </button>
      </div>
      <div role="status" aria-live="polite" className="x-field--full">
        {status.kind === "ok" && <p className="x-status-msg x-status-msg--ok">{status.text}</p>}
      </div>
      <div role="alert" className="x-field--full">
        {status.kind === "err" && <p className="x-status-msg x-status-msg--err">{status.text}</p>}
      </div>
    </form>
  );
}
