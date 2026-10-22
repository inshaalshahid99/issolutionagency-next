"use client";

/**
 * Client capability checks shared by the heavy effects.
 * "lite" = touch, reduced motion, save-data or low-power devices
 * (hardwareConcurrency <= 4 or deviceMemory <= 4). Effects like the custom
 * cursor, magnetic buttons and the hero dot canvas are skipped in lite mode.
 */
type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

export function isLite() {
  if (typeof window === "undefined") return true;
  return document.documentElement.classList.contains("x-lite");
}

/** The same detection as the inline boot script, for code that runs before it. */
export function detectLite() {
  const n = navigator as NavigatorExtras;
  const coarse = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const low =
    !!n.connection?.saveData ||
    (n.deviceMemory !== undefined && n.deviceMemory <= 4) ||
    (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 4);
  return coarse || prefersReducedMotion() || low;
}

/** Animations are on when the boot script added `x-anim` (no reduced motion). */
export function animOn() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("x-anim");
}
