"use client";

/**
 * Pulseboard: fictional product-analytics SaaS demo (React).
 * Ported from the preview's htm/UMD build to typed React components.
 * Every number is generated sample data.
 */
import { Fragment, useEffect, useMemo, useState } from "react";

type Range = "7d" | "30d" | "90d";
type Kpi = { l: string; v: number; f: (x: number) => string; d: number };

const DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const isReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function gen(range: Range, tick = 0) {
  const n = DAYS[range];
  const r = rng(n * 97 + 13 + tick * 7919);
  const base = 1800 + n * 12;
  const pts = Array.from({ length: n }, (_, i) => Math.round(base * (0.8 + (i / n) * 0.35) + (r() - 0.5) * base * 0.3));
  const visitors = pts.reduce((a, b) => a + b, 0);
  const signups = visitors * (0.035 + r() * 0.01);
  const events = ["Page viewed", "Signed up", "Report shared", "Invite sent", "Export CSV"].map((name, i) => ({ name, v: Math.round(visitors * (0.9 - i * 0.17) * (0.8 + r() * 0.3)) }));
  const kpis: Kpi[] = [
    { l: "Visitors", v: visitors, f: fmt, d: 6 + r() * 8 },
    { l: "Signups", v: signups, f: fmt, d: 4 + r() * 10 },
    { l: "Conversion", v: (signups / visitors) * 100, f: (x) => x.toFixed(2) + "%", d: 1 + r() * 3 },
    { l: "MRR", v: 18000 + n * 140, f: (x) => "$" + fmt(x), d: 3 + r() * 5 },
  ];
  const funnel = [100, 38 + r() * 6, 19 + r() * 5, 6 + r() * 3].map((p, i) => ({ s: ["Visited site", "Signed up", "Activated", "Paid"][i], p, n: (visitors * p) / 100 }));
  return { pts, events, kpis, funnel };
}

const USERS: [string, string, string, number, string][] = [
  ["Maya Chen", "maya@lumen.io", "Scale", 4820, "2 min ago"],
  ["Jonas Berg", "jonas@fjord.dev", "Growth", 2310, "8 min ago"],
  ["Priya Nair", "priya@orbit.app", "Growth", 1975, "21 min ago"],
  ["Leo Martins", "leo@cobalt.co", "Starter", 640, "1 h ago"],
  ["Ava Thompson", "ava@northwind.io", "Scale", 3902, "2 h ago"],
  ["Kenji Sato", "kenji@kumo.jp", "Starter", 412, "5 h ago"],
  ["Sofia Rossi", "sofia@vela.it", "Growth", 1288, "Yesterday"],
  ["Omar Haddad", "omar@dune.ai", "Scale", 2754, "Yesterday"],
];
const FEED: [string, string][] = [
  ["Maya", "shared a report"],
  ["Jonas", "created a funnel"],
  ["Priya", "signed up"],
  ["Leo", "set an alert"],
  ["Ava", "invited 3 teammates"],
  ["Kenji", "downloaded a CSV"],
  ["Sofia", "viewed Retention"],
  ["Omar", "upgraded to Scale"],
];

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: isReduced() ? "auto" : "smooth" });
};

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function useCount(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    if (isReduced()) {
      raf = requestAnimationFrame(() => setV(target));
      return () => cancelAnimationFrame(raf);
    }
    let t0: number | undefined;
    const step = (t: number) => {
      t0 ??= t;
      const k = Math.min((t - t0) / 900, 1);
      setV(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function KpiCard({ k }: { k: Kpi }) {
  const v = useCount(k.v);
  return (
    <div className="kpi">
      <small>{k.l}</small>
      <b>{k.f(v)}</b>
      <span className="up">▲ {k.d.toFixed(1)}%</span>
    </div>
  );
}

function Chart({ pts, range }: { pts: number[]; range: Range }) {
  const [hov, setHov] = useState<number | null>(null);
  const W = 600, Hh = 200, P = 8;
  const max = Math.max(...pts) * 1.1, min = Math.min(...pts) * 0.85;
  const x = (i: number) => P + (i / (pts.length - 1)) * (W - 2 * P);
  const y = (v: number) => Hh - P - ((v - min) / (max - min)) * (Hh - 2 * P);
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const move = (e: React.MouseEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    setHov(Math.max(0, Math.min(pts.length - 1, Math.round(((e.clientX - b.left) / b.width) * (pts.length - 1)))));
  };
  const ago = hov == null ? 0 : pts.length - 1 - hov;
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label={`Daily visitors over the last ${range}, trending up`} onMouseMove={move} onMouseLeave={() => setHov(null)}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3B5BFD" stopOpacity=".22" />
            <stop offset="1" stopColor="#3B5BFD" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={Hh * f} y2={Hh * f} stroke="#EEF1F6" />
        ))}
        <path d={line + `L${x(pts.length - 1)},${Hh}L${x(0)},${Hh}Z`} fill="url(#g)" />
        <path d={line} fill="none" stroke="#3B5BFD" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hov != null && (
          <g>
            <line x1={x(hov)} x2={x(hov)} y1="0" y2={Hh} stroke="#CBD5E1" strokeDasharray="3 4" />
            <circle cx={x(hov)} cy={y(pts[hov])} r="5" fill="#fff" stroke="#3B5BFD" strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {hov != null && (
        <div className="tip" style={{ left: (x(hov) / W) * 100 + "%" }}>
          {ago ? ago + " days ago" : "Today"} · <b>{fmt(pts[hov])}</b> visitors
        </div>
      )}
    </div>
  );
}

function Feed() {
  const [items, setItems] = useState(() => FEED.slice(0, 4).map((f, i) => ({ id: i, f, t: `${(i + 1) * 3}s ago` })));
  useEffect(() => {
    let n = 4;
    const id = setInterval(() => {
      const item = { id: n, f: FEED[n % FEED.length], t: "just now" };
      n += 1;
      setItems((xs) => [item, ...xs].slice(0, 5));
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <ul className="feed" aria-live="polite" aria-label="Live activity">
      {items.map((it) => (
        <li key={it.id}>
          <span className="b" />
          <span>
            <b>{it.f[0]}</b> {it.f[1]}
          </span>
          <em>{it.t}</em>
        </li>
      ))}
    </ul>
  );
}

function Users() {
  const [q, setQ] = useState("");
  const rows = USERS.filter((u) => (u[0] + u[1] + u[2]).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <label className="sr" htmlFor="uq" style={{ position: "absolute", left: "-999px" }}>
        Search users
      </label>
      <input id="uq" className="search" type="search" placeholder="Search name, email or plan" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="tw" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Plan</th>
              <th scope="col">Events</th>
              <th scope="col">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u[1]}>
                <td>
                  <b>{u[0]}</b>
                  <br />
                  <small style={{ color: "#475569" }}>{u[1]}</small>
                </td>
                <td>
                  <span className="plan">{u[2]}</span>
                </td>
                <td>{fmt(u[3])}</td>
                <td>{u[4]}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4}>No users match “{q}”.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard() {
  const [view, setView] = useState("Overview");
  const [range, setRange] = useState<Range>("30d");
  const [tick, setTick] = useState(0);
  const d = useMemo(() => gen(range, tick), [range, tick]);
  const views: [string, string][] = [
    ["Overview", "M3 12h4l3-8 4 16 3-8h4"],
    ["Users", "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"],
    ["Funnels", "M3 5h18l-7 8v6l-4 2v-8z"],
  ];
  const maxE = Math.max(...d.events.map((e) => e.v));
  return (
    <div className="card app">
      <div className="app__bar">
        <span className="d" />
        <span className="d" />
        <span className="d" />
        <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8 }}>app.pulseboard.io</span>
        <span className="sample">Sample data</span>
      </div>
      <div className="app__body">
        <nav className="side" aria-label="Dashboard views">
          {views.map(([v, ic]) => (
            <button
              key={v}
              aria-current={view === v}
              title={view === v ? "Refresh sample data" : v}
              onClick={() => {
                if (view === v) setTick((t) => t + 1);
                else setView(v);
              }}
            >
              <Icon d={ic} />
              {v}
            </button>
          ))}
        </nav>
        <div className="main">
          <div className="top">
            <h3>{view}</h3>
            {view !== "Users" && (
              <div className="seg" role="group" aria-label="Date range">
                {(Object.keys(DAYS) as Range[]).map((r) => (
                  <button key={r} aria-pressed={range === r} onClick={() => setRange(r)}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          {view === "Overview" && (
            <div>
              <div className="kpis">
                {d.kpis.map((k) => (
                  <KpiCard key={k.l + range + tick} k={k} />
                ))}
              </div>
              <div className="grid2">
                <div className="panel">
                  <h4>Visitors per day</h4>
                  <Chart pts={d.pts} range={range} />
                </div>
                <div className="panel">
                  <h4>Top events</h4>
                  <ul className="bars">
                    {d.events.map((e) => (
                      <li key={e.name}>
                        <div>
                          <span>{e.name}</span>
                          <b>{fmt(e.v)}</b>
                        </div>
                        <i>
                          <span style={{ width: (e.v / maxE) * 100 + "%" }} />
                        </i>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="panel" style={{ marginTop: 12 }}>
                <h4>
                  Live activity{" "}
                  <span className="sample" style={{ marginLeft: 8 }}>
                    ● Live
                  </span>
                </h4>
                <Feed />
              </div>
            </div>
          )}
          {view === "Users" && <Users />}
          {view === "Funnels" && (
            <div className="panel">
              <h4>Signup to paid, last {range}</h4>
              <div className="fun">
                {d.funnel.map((f) => (
                  <div key={f.s}>
                    <div className="l">
                      {f.s}
                      <span>
                        {fmt(f.n)} · {f.p.toFixed(1)}%
                      </span>
                    </div>
                    <i>
                      <span style={{ width: f.p + "%" }} />
                    </i>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FEATS: [string, string, string][] = [
  ["Real-time events", "See every click, signup and upgrade within a second of it happening.", "M13 2 3 14h9l-1 8 10-12h-9z"],
  ["Funnels", "Find the step where users drop off, and watch it improve after each release.", "M3 5h18l-7 8v6l-4 2v-8z"],
  ["Retention", "Cohort curves that show who comes back in week one, four and twelve.", "M3 3v18h18M7 15l4-4 3 3 5-6"],
  ["Team dashboards", "Shared boards everyone can read, from founders to support.", "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z"],
  ["Alerts", "Get a Slack or email ping when a metric moves past the line you set.", "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"],
  ["Privacy-first", "No cookies, EU hosting and IP anonymisation by default.", "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
];
const PLANS = [
  { n: "Starter", m: 0, y: 0, d: "For side projects", f: ["10k events / month", "1 dashboard", "7-day history"], c: "Start free", hi: false },
  { n: "Growth", m: 29, y: 24, d: "For growing teams", f: ["1M events / month", "Unlimited dashboards", "Funnels and retention", "Slack alerts"], c: "Start 14-day trial", hi: true },
  { n: "Scale", m: 99, y: 82, d: "For data-heavy products", f: ["10M events / month", "SSO and audit log", "Unlimited history", "Priority support"], c: "Talk to sales", hi: false },
];
const FAQS: [string, string][] = [
  ["Is this a real product?", "No. Pulseboard is a fictional SaaS, and every number in the dashboard is generated sample data."],
  ["How long does setup take?", "In the concept, one script tag or SDK call. Events show up on your dashboard in seconds."],
  ["Can I switch plans later?", "Yes, upgrade or downgrade at any time. Yearly plans are billed up front at the discounted rate."],
  ["Do you use cookies?", "No. Pulseboard is designed to be privacy-first, with no cookies and anonymised IPs."],
];

function Pricing() {
  const [yr, setYr] = useState(false);
  return (
    <div>
      <div className="center">
        <div className="sw">
          <span className={yr ? "" : "on"}>{yr ? "Monthly" : <b>Monthly</b>}</span>
          <button role="switch" aria-checked={yr} aria-label="Yearly billing, save about 17%" onClick={() => setYr(!yr)}>
            <i />
          </button>
          <span>{yr ? <b>Yearly · save ~17%</b> : "Yearly · save ~17%"}</span>
        </div>
      </div>
      <div className="prices">
        {PLANS.map((p) => (
          <div key={p.n} className={"card price" + (p.hi ? " hi" : "")}>
            {p.hi && <span className="badge">Most popular</span>}
            <h3>{p.n}</h3>
            <p className="amt">
              ${yr ? p.y : p.m}
              <small>/mo</small>
            </p>
            <p className="note">
              {p.m ? (yr ? "Billed yearly" : "Billed monthly") : "Free forever"} · {p.d}
            </p>
            <ul>
              {p.f.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a className={"btn " + (p.hi ? "btn--p" : "btn--g")} href="#cta" onClick={go("cta")}>
              {p.c}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {FAQS.map(([q, a], i) => (
        <div key={i} className="card">
          <h3>
            <button aria-expanded={open === i} aria-controls={"fa" + i} onClick={() => setOpen(open === i ? -1 : i)}>
              {q}
              <span aria-hidden="true">+</span>
            </button>
          </h3>
          <p id={"fa" + i} hidden={open !== i}>
            {a}
          </p>
        </div>
      ))}
    </div>
  );
}

function Signup() {
  const [v, setV] = useState("");
  const [m, setM] = useState<{ ok?: boolean; t: string } | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setM(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? { ok: true, t: "Thanks! Demo form, nothing is sent." } : { t: "Please enter a valid email address." });
  };
  return (
    <form className="form" onSubmit={submit} noValidate>
      <label htmlFor="em" style={{ position: "absolute", left: "-999px" }}>
        Work email
      </label>
      <input id="em" type="email" placeholder="you@company.com" value={v} aria-invalid={m && !m.ok ? "true" : "false"} aria-describedby="msg" onChange={(e) => setV(e.target.value)} />
      <button className="btn btn--l" type="submit">
        Start free
      </button>
      <p id="msg" role="status" className={"msg " + (m ? (m.ok ? "ok" : "err") : "")} style={{ width: "100%" }}>
        {m ? m.t : "Demo form, nothing is sent."}
      </p>
    </form>
  );
}

export function PulseboardApp({ banner }: { banner?: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const nav = (id: string) => (e: React.MouseEvent) => {
    setMenu(false);
    go(id)(e);
  };
  return (
    <Fragment>
      <a className="skip" href="#main">
        Skip to content
      </a>
      {banner}
      <header className={"nav" + (menu ? " open" : "")}>
        <div className="wrap">
          <a className="logo" href="#main" onClick={nav("main")}>
            <i>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8F35A" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                <path d="M3 12h4l3-7 4 14 3-7h4" />
              </svg>
            </i>
            Pulseboard
          </a>
          <nav className="links" id="menu" aria-label="Main">
            <a href="#product" onClick={nav("product")}>
              Product
            </a>
            <a href="#pricing" onClick={nav("pricing")}>
              Pricing
            </a>
            <a href="#faq" onClick={nav("faq")}>
              FAQ
            </a>
            <a className="btn btn--p" href="#cta" onClick={nav("cta")}>
              Start free
            </a>
          </nav>
          <a className="btn btn--p cta" href="#cta" onClick={nav("cta")}>
            Start free
          </a>
          <button className="burger" aria-expanded={menu} aria-controls="menu" aria-label="Menu" onClick={() => setMenu(!menu)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={menu ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <div className="wrap">
            <span className="tag">
              <i />
              Live product analytics
            </span>
            <h1>
              Know what your product is doing, <em>live.</em>
            </h1>
            <p>Real-time product analytics your whole team can read in seconds.</p>
            <div className="row">
              <a className="btn btn--p" href="#demo" onClick={go("demo")}>
                Try the live demo
              </a>
              <a className="btn btn--g" href="#pricing" onClick={go("pricing")}>
                See pricing
              </a>
            </div>
          </div>
        </section>
        <section id="demo" className="sec" style={{ paddingTop: 16 }} aria-label="Interactive dashboard demo">
          <div className="wrap">
            <Dashboard />
          </div>
        </section>
        <section id="product" className="sec">
          <div className="wrap">
            <div className="sec__h">
              <p className="eyebrow">Product</p>
              <h2>Everything you need to read your product.</h2>
              <p>Six tools, one dashboard, no SQL.</p>
            </div>
            <div className="feats">
              {FEATS.map(([t, p, ic]) => (
                <div key={t} className="card feat">
                  <div className="ico">
                    <Icon d={ic} />
                  </div>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="sec">
          <div className="wrap">
            <div className="sec__h">
              <p className="eyebrow">Pricing</p>
              <h2>Simple plans that grow with you.</h2>
            </div>
            <Pricing />
          </div>
        </section>
        <section id="faq" className="sec">
          <div className="wrap">
            <div className="sec__h">
              <p className="eyebrow">FAQ</p>
              <h2>Questions, answered.</h2>
            </div>
            <Faq />
          </div>
        </section>
        <section id="cta" className="sec">
          <div className="wrap">
            <div className="cta-box">
              <h2>See your product live in five minutes.</h2>
              <p>Start free, no card needed.</p>
              <Signup />
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap">© Pulseboard, a demo product site designed and built in React by ISSolutionAgency.</div>
      </footer>
    </Fragment>
  );
}
