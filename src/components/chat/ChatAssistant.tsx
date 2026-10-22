"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { site } from "@/content/site";
import { prefillContact } from "@/lib/contact-prefill";
import { scrollToHash } from "@/lib/scroll";

/**
 * "Plan your project" assistant.
 * - AI mode: streams from /api/chat (OpenAI-compatible, key on the server).
 * - Demo mode (no key, or the API is unavailable): the preview's scripted
 *   five-question flow, clearly labelled as a demo.
 * "Talk to a human" is always visible and hands the conversation to the contact form.
 */

type Line = { id: number; who: "me" | "bot"; text: string; note?: boolean };
type Mode = "ai" | "demo";

const EMAIL_RE = /[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]{2,}/;
const START_CHIPS = ["Website", "Web app", "E-commerce", "AI chatbot/automation", "Fix an AI-built app"];
const SVC_MAP: Record<string, string> = {
  Website: "Custom Websites",
  "Web app": "Web Applications",
  "E-commerce": "E-commerce",
  "AI chatbot/automation": "AI Chatbots & Automation",
  "Fix an AI-built app": "AI-App Rescue",
};
const STEPS = [
  { key: "build", label: "Looking to build", q: "What are you looking to build?", opts: [...START_CHIPS, "Something else"], other: "Something else" },
  { key: "existing", label: "Existing site or codebase", q: "Do you have an existing site or codebase?", opts: ["Yes", "No", "Not sure"] },
  { key: "stack", label: "Preferred stack", q: "Preferred stack?", opts: ["No preference — recommend one", "React/Next.js", "WordPress", "Shopify", "Laravel/PHP", "Other"], other: "Other" },
  { key: "timeline", label: "Timeline", q: "Rough timeline?", opts: ["ASAP", "1–2 months", "3+ months", "Flexible"] },
  { key: "contact", label: "Contact", q: "Your name and email?", opts: [] as string[], ph: "Jane Doe, jane@company.com" },
] as const;

let uid = 0;

export default function ChatAssistant({ aiEnabled }: { aiEnabled: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(aiEnabled ? "ai" : "demo");
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("Type your message");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState(false);
  // demo flow state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [other, setOther] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const aiHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // show the launcher once the preloader is gone
  useEffect(() => {
    const root = document.documentElement;
    const show = () => {
      root.classList.add("x-cb-on");
      setReady(true);
    };
    if (window.__issLoader === "running") {
      window.addEventListener("iss:loader-done", show, { once: true });
      const t = window.setTimeout(show, 6500);
      return () => {
        window.removeEventListener("iss:loader-done", show);
        clearTimeout(t);
      };
    }
    show();
  }, []);

  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines, typing]);

  const push = useCallback((who: Line["who"], text: string, note = false) => {
    const id = ++uid;
    setLines((l) => [...l, { id, who, text, note }]);
    return id;
  }, []);

  /** Bot lines with a short typing indicator (demo flow). */
  const bot = useCallback(
    (texts: string[] | string, cb?: () => void) => {
      const queue = ([] as string[]).concat(texts);
      setBusy(true);
      const next = () => {
        const t = queue.shift();
        if (t === undefined) {
          setBusy(false);
          cb?.();
          return;
        }
        setTyping(true);
        window.setTimeout(() => {
          setTyping(false);
          push("bot", t);
          next();
        }, reduce ? 250 : 550 + Math.min(t.length * 9, 600));
      };
      next();
    },
    [push, reduce],
  );

  /* ---------------- demo flow ---------------- */
  const askStep = useCallback(
    (i: number) => {
      const s = STEPS[i];
      setPlaceholder("ph" in s ? s.ph : "Or type your own answer");
      bot(s.q, () => setChips([...s.opts]));
    },
    [bot],
  );

  const startDemo = useCallback(
    (fallbackNote?: string) => {
      setMode("demo");
      setStep(0);
      setAnswers({});
      setDone(false);
      setOther(false);
      const intro = ["Hi! I'm the ISS Assistant, a scripted demo of the chatbots we build.", "Five quick questions and I'll turn your answers into a project brief."];
      bot(fallbackNote ? [fallbackNote, ...intro] : intro, () => askStep(0));
    },
    [askStep, bot],
  );

  const demoAnswer = (text: string, fromChip: boolean) => {
    text = text.trim();
    if (busy || done) return;
    const s = STEPS[step];
    if (!text) {
      setErr(s.key === "contact" ? "Please enter your name and email." : "Type an answer or pick an option above.");
      return;
    }
    if (s.key === "contact") return demoContact(text);
    setErr("");
    if (fromChip && "other" in s && text === s.other) {
      push("me", text);
      setChips([]);
      setOther(true);
      bot("Sure. Describe it in a few words below.", () => {
        setPlaceholder("Describe it here");
        inputRef.current?.focus();
      });
      return;
    }
    push("me", text);
    setChips([]);
    setInput("");
    setAnswers((a) => ({ ...a, [s.key]: other && "other" in s ? `${s.other}: ${text}` : text }));
    setOther(false);
    const priceQ = !fromChip && /price|cost|how much|budget|quote|\$|deadline|how long/i.test(text);
    const nextStep = step + 1;
    setStep(nextStep);
    if (priceQ) bot("I can't quote prices or deadlines here; a developer will cover that when they reply to your brief.", () => askStep(nextStep));
    else askStep(nextStep);
  };

  const demoContact = (text: string) => {
    const m = text.match(EMAIL_RE);
    const email = m ? m[0] : "";
    if (!email && text.includes("@")) {
      setErr("That email doesn't look right. Try name@company.com.");
      return;
    }
    const name = (email ? text.replace(email, "") : text)
      .replace(/[,;<>]|\band\b|\bmy name is\b|\bi'?m\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!email && answers.name) {
      setErr("Please enter a valid email, like name@company.com.");
      return;
    }
    setErr("");
    push("me", text);
    setInput("");
    const next = { ...answers };
    if (name && !(answers.name && email)) next.name = name;
    if (email) next.email = email;
    setAnswers(next);
    if (!next.email) bot(`Thanks${next.name ? ", " + next.name.split(" ")[0] : ""}. And your email?`, () => setPlaceholder("jane@company.com"));
    else if (!next.name) bot("Got it. And your name?", () => setPlaceholder("Jane Doe"));
    else {
      setDone(true);
      setChips([]);
      bot(`Thanks, ${next.name.split(" ")[0]}. Here's your brief.`);
    }
  };

  const briefRows = (): [string, string][] =>
    STEPS.filter((s) => s.key !== "contact").reduce<[string, string][]>((acc, s) => (answers[s.key] ? [...acc, [s.label, answers[s.key]]] : acc), [
      ["Name", answers.name || ""],
      ["Email", answers.email || ""],
    ]);
  const briefText = () => briefRows().map(([k, v]) => `${k}: ${v}`).join("\n");

  /* ---------------- AI flow ---------------- */
  const sendAI = async (text: string) => {
    text = text.trim();
    if (!text || busy) return;
    setErr("");
    setChips([]);
    setInput("");
    push("me", text);
    aiHistory.current.push({ role: "user", content: text });
    setBusy(true);
    setTyping(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: aiHistory.current }),
        signal: ctrl.signal,
      });
      if (res.status === 503) {
        const j = (await res.json().catch(() => ({}))) as { fallback?: boolean };
        if (j.fallback) {
          setTyping(false);
          setBusy(false);
          aiHistory.current = [];
          setLines([]);
          startDemo("Live AI isn't switched on yet, so here's the scripted demo instead.");
          return;
        }
      }
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      let id = 0;
      for (;;) {
        const { done: d, value } = await reader.read();
        if (d) break;
        acc += dec.decode(value, { stream: true });
        if (!id) {
          setTyping(false);
          id = push("bot", acc);
        } else {
          const cur = acc;
          setLines((l) => l.map((x) => (x.id === id ? { ...x, text: cur } : x)));
        }
      }
      setTyping(false);
      if (!acc.trim()) throw new Error("The assistant didn't reply. Please try again or talk to a human.");
      aiHistory.current.push({ role: "assistant", content: acc });
    } catch (e) {
      setTyping(false);
      if ((e as Error).name !== "AbortError") {
        aiHistory.current.pop();
        push("bot", (e as Error).message || "Something went wrong.", true);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const startAI = useCallback(() => {
    setMode("ai");
    bot(["Hi! I'm the ISS Assistant. I can help you scope your project: type, stack, timeline and budget.", "What are you looking to build?"], () => setChips(START_CHIPS));
  }, [bot]);

  /* ---------------- open / close / handoff ---------------- */
  const openPanel = useCallback(() => {
    setOpen(true);
    const nav = document.querySelector(".x-nav");
    panelRef.current?.parentElement?.style.setProperty("--x-ct", (nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 60) + 12 + "px");
    if (!started) {
      setStarted(true);
      if (aiEnabled) startAI();
      else startDemo();
    }
    window.setTimeout(() => {
      const phone = window.matchMedia("(max-width: 600px)").matches;
      (phone ? closeRef.current : inputRef.current || closeRef.current)?.focus({ preventScroll: true });
    }, reduce ? 0 : 120);
  }, [aiEnabled, reduce, startAI, startDemo, started]);

  const closePanel = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const topic = (e as CustomEvent<{ topic?: string }>).detail?.topic;
      if (open) {
        setNudge(false);
        requestAnimationFrame(() => setNudge(true));
        window.setTimeout(() => setNudge(false), 700);
        inputRef.current?.focus({ preventScroll: true });
      } else openPanel();
      if (topic && mode === "ai") setInput(`I'm interested in the ${topic} package.`);
    };
    window.addEventListener("iss:open-chat", onOpen);
    return () => window.removeEventListener("iss:open-chat", onOpen);
  }, [mode, open, openPanel]);

  // the mobile menu takes over: close the assistant
  useEffect(() => {
    const onLock = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail && document.querySelector('.x-burger[aria-expanded="true"]')) setOpen(false);
    };
    window.addEventListener("iss:scroll-lock", onLock);
    return () => window.removeEventListener("iss:scroll-lock", onLock);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handoff = () => {
    let message: string;
    let name: string | undefined;
    let email: string | undefined;
    let service: string | undefined;
    if (mode === "demo") {
      name = answers.name;
      email = answers.email;
      service = answers.build ? SVC_MAP[answers.build] : undefined;
      const t = briefText();
      message = t.trim() ? `Project brief from the website assistant:\n${t}` : "";
    } else {
      const said = aiHistory.current.filter((m) => m.role === "user").map((m) => `- ${m.content}`);
      const all = aiHistory.current.map((m) => m.content).join(" ");
      email = all.match(EMAIL_RE)?.[0];
      message = said.length ? `From my chat with the website assistant:\n${said.join("\n")}` : "";
    }
    prefillContact({ name, email, service, message: message || undefined, focus: "budget" });
    closePanel(false);
    if (document.getElementById("contact") && pathname !== "/contact") scrollToHash("#contact");
    else if (pathname !== "/contact") router.push("/contact");
    else scrollToHash("#contact");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "ai") sendAI(input);
    else demoAnswer(input, false);
  };
  const onChip = (c: string) => {
    if (mode === "ai") sendAI(c);
    else demoAnswer(c, true);
  };
  const restart = () => {
    abortRef.current?.abort();
    aiHistory.current = [];
    setLines([]);
    setErr("");
    setChips([]);
    setInput("");
    if (mode === "ai") startAI();
    else {
      setStep(0);
      setAnswers({});
      setDone(false);
      bot("Let's start again.", () => askStep(0));
    }
  };

  const mailBrief = `mailto:${site.email}?subject=${encodeURIComponent("Project brief from website")}&body=${encodeURIComponent(`Hi ${site.name},\r\n\r\nHere's my project brief:\r\n\r\n${briefText().replace(/\n/g, "\r\n")}\r\n`)}`;

  return (
    <div className={`x-cb${open ? " is-open" : ""}`} id="x-cb">
      <button
        ref={btnRef}
        className="x-cb__btn"
        id="x-cb-btn"
        type="button"
        aria-expanded={open}
        aria-controls="x-cb-panel"
        aria-label={open ? "Close assistant" : "Plan your project with the ISS Assistant"}
        tabIndex={ready ? 0 : -1}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) {
            e.preventDefault();
            closePanel();
          }
        }}
      >
        <svg className="x-cb__ic-c" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1121 12z" />
          <path d="M12 8.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" />
        </svg>
        <svg className="x-cb__ic-x" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span className="x-cb__tip" aria-hidden="true">
          Plan your project
        </span>
      </button>
      <div
        ref={panelRef}
        className={`x-cb__panel${open ? " is-open" : ""}${nudge ? " x-cb-nudge" : ""}`}
        id="x-cb-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="x-cb-title"
        data-lenis-prevent=""
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            closePanel();
            return;
          }
          if (e.key !== "Tab" || !panelRef.current) return;
          const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])")).filter((el) => el.offsetParent !== null);
          if (!f.length) return;
          const a = f[0], z = f[f.length - 1];
          if (e.shiftKey && (document.activeElement === a || !panelRef.current.contains(document.activeElement))) {
            e.preventDefault();
            z.focus();
          } else if (!e.shiftKey && document.activeElement === z) {
            e.preventDefault();
            a.focus();
          }
        }}
      >
        <div className="x-cb__hd">
          <span className="x-cb__av" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z" />
              <path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
            </svg>
          </span>
          <div>
            <h2 id="x-cb-title">ISS Assistant</h2>
            <span className="x-cb__badge">{mode === "ai" ? "AI assistant · can make mistakes" : "Demo · scripted, not live AI"}</span>
          </div>
          <button ref={closeRef} className="x-cb__x" type="button" aria-label="Close assistant" onClick={() => closePanel()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="x-cb__log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions" tabIndex={-1}>
          {lines.map((l) => (
            <p key={l.id} className={`x-cb__m x-cb__m--${l.who}${l.note ? " x-cb__m--note" : ""}`} style={{ whiteSpace: "pre-wrap" }}>
              <span className="x-cb__sr">{l.who === "me" ? "You: " : "Assistant: "}</span>
              {l.text}
            </p>
          ))}
          {typing && (
            <div className="x-cb__m x-cb__m--bot x-cb__typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          )}
          {mode === "demo" && done && !busy && (
            <div className="x-cb__sum">
              <h3>Your project brief</h3>
              <dl>
                {briefRows().map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="x-cb__acts">
                <a className="x-btn x-btn--grad" href={mailBrief}>
                  Send this brief
                </a>
                <button type="button" className="x-btn" onClick={handoff}>
                  Or use the contact form
                </button>
              </div>
              <p>“Send this brief” opens your email app with the brief ready to send.</p>
              <button type="button" className="x-cb__again" onClick={restart}>
                Start over
              </button>
            </div>
          )}
        </div>
        <div className="x-cb__qr" role="group" aria-label="Quick replies">
          {chips.map((c, k) => (
            <button key={c} type="button" style={{ "--i": k } as React.CSSProperties} onClick={() => onChip(c)} disabled={busy}>
              {c}
            </button>
          ))}
        </div>
        <form className="x-cb__in" noValidate onSubmit={onSubmit} hidden={mode === "demo" && done}>
          <input
            ref={inputRef}
            id="x-cb-input"
            type="text"
            aria-label="Your message"
            autoComplete="off"
            placeholder={mode === "ai" ? "Type your message" : placeholder}
            aria-describedby="x-cb-err"
            aria-invalid={err ? true : undefined}
            value={input}
            maxLength={2000}
            onChange={(e) => {
              setInput(e.target.value);
              if (err) setErr("");
            }}
          />
          <button className="x-cb__send" type="submit" aria-label="Send" disabled={busy}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
        <p className="x-cb__err" id="x-cb-err" role="alert">
          {err}
        </p>
        <div className="x-cb__ft">
          <span>
            Prefer a person?{" "}
            {mode === "ai" && lines.length > 2 && (
              <button type="button" className="x-cb__again" onClick={restart} style={{ marginLeft: 4 }}>
                Restart
              </button>
            )}
          </span>
          <span style={{ display: "inline-flex", gap: 12 }}>
            <button type="button" className="x-cb__human" onClick={handoff}>
              Talk to a human
            </button>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Question from website")}`} aria-label={`Email ${site.email}`}>
              Email
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
