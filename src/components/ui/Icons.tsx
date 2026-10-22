/** Line icons from the preview (stroke-based, styled by .x-icon svg rules). */
import type { ServiceIcon } from "@/content/services";

const svc: Record<ServiceIcon, React.ReactNode> = {
  browser: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
  grid: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  bag: <path d="M5 7h14l-1.5 11a2 2 0 01-2 2h-7a2 2 0 01-2-2zM9 7a3 3 0 016 0" />,
  doc: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5M8 12l2-2 2 2 2-3" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  chat: <><path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1121 12z" /><path d="M12 8.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 00-5.4 5.1L3.5 17.2a1.8 1.8 0 002.5 2.5l5.8-5.8a4 4 0 005.1-5.4l-2.4 2.4-2.3-.4-.4-2.3z" />,
};

export function ServiceGlyph({ name }: { name: ServiceIcon }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{svc[name]}</svg>;
}

const outcome = {
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  bars: <path d="M3 20h18M6 16v-4M11 16V8M16 16V4" />,
};

export function OutcomeGlyph({ name }: { name: keyof typeof outcome }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{outcome[name]}</svg>;
}

export const ArrowRightSvg = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowUpRightSvg = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>;
export const CheckSvg = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const ClockSvg = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
export const ChatSvg = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1121 12z" /></svg>;
