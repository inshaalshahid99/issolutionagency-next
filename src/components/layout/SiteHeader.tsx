"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, stagger } from "motion/react";
import { PrismCube, Wordmark } from "@/components/brand/PrismCube";
import { SocialIcons } from "@/components/brand/SocialIcons";
import { mainNav, mobileNav, site, socials } from "@/content/site";
import { scrollToHash } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion-prefs";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const HOME_SECTIONS = ["services", "work", "about", "process", "packages", "contact"];
const SECTION_TO_HREF: Record<string, string> = {
  services: "/services",
  work: "/work",
  about: "/about",
  process: "/process",
  packages: "/#packages",
  contact: "/contact",
};

/**
 * Announcement bar + fixed header (transparent at top, glass after 40px,
 * 72px -> 60px) + full-screen circle clip-path menu below 1024px.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const afterClose = useRef<(() => void) | null>(null);
  const openRef = useRef(false);
  const [barOpen, setBarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // header follows the announcement bar until it scrolls away
  const navSync = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const b = barRef.current ? Math.max(0, barRef.current.getBoundingClientRect().bottom) : 0;
    nav.style.setProperty("--x-bt", b + "px");
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    navSync();
    window.addEventListener("scroll", navSync, { passive: true });
    window.addEventListener("resize", navSync);
    return () => {
      window.removeEventListener("scroll", navSync);
      window.removeEventListener("resize", navSync);
    };
  }, [navSync, barOpen]);

  const markActive = useCallback(() => {
    if (!isHome) return setActiveSection(null);
    let cur: string | null = null;
    HOME_SECTIONS.forEach((id) => {
      const s = document.getElementById(id);
      if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) cur = id;
    });
    setActiveSection(cur);
  }, [isHome]);

  const finishClose = useCallback(() => {
    const menu = menuRef.current;
    if (menu) {
      menu.inert = true;
      menu.style.visibility = "hidden";
      menu.style.opacity = "0";
      menu.style.clipPath = "";
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.dispatchEvent(new CustomEvent("iss:scroll-lock", { detail: false }));
    const fn = afterClose.current;
    afterClose.current = null;
    if (fn) fn();
  }, []);

  const setMenu = useCallback(
    (next: boolean) => {
      if (next === openRef.current) return;
      openRef.current = next;
      setOpen(next);
      const menu = menuRef.current;
      const burger = burgerRef.current;
      const nav = navRef.current;
      if (!menu || !burger || !nav) return;
      const reduce = prefersReducedMotion();
      const br = burger.getBoundingClientRect();
      const x = br.left + br.width / 2;
      const y = br.top + br.height / 2;
      const R = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))) + 20;
      const at = ` at ${x}px ${y}px)`;
      const rows = Array.from(menu.querySelectorAll<HTMLElement>(".x-menu__m"));
      const nums = Array.from(menu.querySelectorAll<HTMLElement>(".x-menu__m small"));
      const foot = Array.from(menu.querySelectorAll<HTMLElement>(".x-menu__fi"));
      const bg = menu.querySelector<HTMLElement>(".x-menu__bg");

      if (next) {
        afterClose.current = null;
        menu.style.setProperty("--x-mt", nav.getBoundingClientRect().bottom + "px");
        markActive();
        menu.inert = false;
        menu.classList.remove("is-revealed");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        window.dispatchEvent(new CustomEvent("iss:scroll-lock", { detail: true }));
        menu.style.visibility = "visible";
        menu.style.opacity = "1";
        if (reduce) {
          menu.classList.add("is-revealed");
        } else {
          animate(menu, { clipPath: [`circle(0px${at}`, `circle(${R}px${at}`] }, { duration: 0.7, ease: EXPO_OUT });
          if (bg) animate(bg, { opacity: [0, 1], scale: [1.15, 1] }, { duration: 1, delay: 0.1, ease: EXPO_OUT });
          animate(rows, { y: ["115%", "0%"] }, { duration: 0.8, delay: stagger(0.06, { startDelay: 0.38 }), ease: EXPO_OUT });
          animate(nums, { opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.06, { startDelay: 0.5 }) });
          animate(foot, { opacity: [0, 1], y: [24, 0] }, {
            duration: 0.7,
            delay: stagger(0.07, { startDelay: 0.38 + rows.length * 0.06 + 0.08 }),
            ease: EXPO_OUT,
          }).then(() => {
            if (openRef.current) menu.classList.add("is-revealed");
          });
        }
        window.setTimeout(() => {
          if (openRef.current) menu.querySelector<HTMLElement>(".x-menu__a")?.focus({ preventScroll: true });
        }, reduce ? 50 : 450);
      } else {
        menu.classList.remove("is-revealed");
        if (reduce) {
          finishClose();
        } else {
          animate(menu, { clipPath: [`circle(${R}px${at}`, `circle(0px${at}`] }, { duration: 0.45, ease: [0.7, 0, 0.84, 0] }).then(
            () => {
              if (!openRef.current) finishClose();
            },
          );
        }
      }
    },
    [finishClose, markActive],
  );

  // close on route change, Escape, focus trap and resize to desktop
  useEffect(() => {
    if (openRef.current) setMenu(false);
  }, [pathname, setMenu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!openRef.current) return;
      if (e.key === "Escape") {
        setMenu(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const f = [logoRef.current, burgerRef.current, ...Array.from(menuRef.current.querySelectorAll<HTMLElement>("a[href]"))].filter(
        Boolean,
      ) as HTMLElement[];
      const i = f.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    };
    const onResize = () => {
      if (openRef.current && innerWidth >= 1024) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [setMenu]);

  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = true;
  }, []);

  const go = useCallback(
    (href: string) => {
      const [path, hash] = href.split("#");
      const targetPath = path || pathname;
      if (hash && targetPath === pathname) scrollToHash("#" + hash);
      else router.push(href);
    },
    [pathname, router],
  );

  const onMenuLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!openRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    afterClose.current = () => go(href);
    setMenu(false);
  };

  const contactHref = isHome ? "#contact" : "/contact";
  const isActive = (href: string) => {
    if (isHome) return activeSection ? SECTION_TO_HREF[activeSection] === href : false;
    const p = href.split("#")[0];
    return p !== "/" && p !== "" && (pathname === p || pathname.startsWith(p + "/"));
  };

  return (
    <>
      {barOpen && (
        <div className="x-bar" id="x-bar" ref={barRef} role="region" aria-label="Announcement">
          <div className="x-bar__m">
            <div className="x-bar__t">
              <span>{site.announcement}</span>
              {[1, 2, 3, 4, 5].map((k) => (
                <span key={k} aria-hidden="true">
                  {site.announcement}
                </span>
              ))}
            </div>
          </div>
          <Link href={contactHref}>Start a project</Link>
          <button type="button" aria-label="Dismiss announcement" onClick={() => setBarOpen(false)}>
            ×
          </button>
        </div>
      )}

      <header ref={navRef} className={`x-nav${scrolled ? " is-scrolled" : ""}${open ? " is-menu" : ""}`}>
        <div className="x-wrap x-nav__in">
          <Link
            ref={logoRef}
            className="x-logo"
            href="/"
            aria-label={`${site.name} home`}
            onClick={(e) => {
              if (openRef.current) onMenuLink(e, "/");
              else if (isHome) {
                e.preventDefault();
                scrollToHash("#top");
              }
            }}
          >
            <PrismCube id="cn" className="x-cube" />
            <Wordmark />
          </Link>
          <nav aria-label="Main">
            <ul className="x-links">
              {mainNav.map((item) => (
                <li key={item.href} className={item.hideBelowXl ? "x-links__why" : undefined}>
                  <Link href={item.href} aria-current={isActive(item.href) && !isHome ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link className="x-btn x-btn--grad x-mag" href={contactHref}>
            Let&apos;s Talk
          </Link>
          <button
            ref={burgerRef}
            className="x-burger x-mag"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="x-menu"
            onClick={() => setMenu(!openRef.current)}
          />
        </div>
      </header>
      <div className="x-navspace" aria-hidden="true" />

      <div className="x-menu x-menu--js" id="x-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent="">
        <div className="x-menu__bg" aria-hidden="true">
          <div className="x-menu__glow x-menu__glow--a" />
          <div className="x-menu__glow x-menu__glow--b" />
        </div>
        <div className="x-wrap x-menu__in">
          <ul className="x-menu__list">
            {mobileNav.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    className={`x-menu__a${active ? " is-active" : ""}`}
                    href={item.href}
                    aria-current={active ? (isHome ? "location" : "page") : undefined}
                    onClick={(e) => onMenuLink(e, item.href)}
                  >
                    <span className="x-menu__m">
                      <small>{String(i + 1).padStart(2, "0")}</small>
                      <span className="x-menu__t">{item.label}</span>
                      <svg className="x-menu__arr" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="x-menu__foot">
            <Link className="x-btn x-btn--grad x-menu__fi" href={contactHref} onClick={(e) => onMenuLink(e, contactHref)}>
              Let&apos;s Talk <span aria-hidden="true">→</span>
            </Link>
            <div className="x-menu__meta">
              <a className="x-menu__mail x-menu__fi" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <div className="x-menu__soc x-menu__fi">
                <SocialIcons items={socials} />
                {socials.every((s) => !s.href) && <p>Links coming soon</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
