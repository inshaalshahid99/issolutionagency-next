"use client";

/**
 * Tiny pub/sub so any button on the page ("Get a quote", "Learn more",
 * the assistant's "Use the contact form") can prefill the contact form.
 */
export type Prefill = {
  name?: string;
  email?: string;
  service?: string;
  /** Only set the service when none is chosen yet. */
  serviceOnlyIfEmpty?: boolean;
  /** Replace the message only when it is empty or still holds the last auto line. */
  message?: string;
  /** Append a line to the message (used by the chatbot add-on). */
  appendLine?: string;
  /** Element to focus after prefilling. */
  focus?: "budget" | "message" | "name";
};

type Listener = (p: Prefill) => void;
const listeners = new Set<Listener>();
let pending: Prefill | null = null;

export function prefillContact(p: Prefill) {
  if (listeners.size === 0) {
    pending = { ...(pending || {}), ...p };
    return;
  }
  listeners.forEach((l) => l(p));
}

export function subscribePrefill(l: Listener) {
  listeners.add(l);
  if (pending) {
    const p = pending;
    pending = null;
    l(p);
  }
  return () => {
    listeners.delete(l);
  };
}
