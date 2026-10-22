import Link from "next/link";
import { PrismCube, Wordmark } from "@/components/brand/PrismCube";
import { SocialIcons } from "@/components/brand/SocialIcons";
import { companyNav, site, socials } from "@/content/site";
import { services } from "@/content/services";
import { BackToTop, FooterWordmark } from "./FooterClient";

export function SiteFooter() {
  const placeholderSocials = socials.every((s) => !s.href);
  return (
    <footer className="x-foot">
      <div className="x-wrap">
        <div className="x-foot__grid">
          <div>
            <Link className="x-logo" href="/" aria-label={`${site.name} home`} style={{ color: "var(--x-text)" }}>
              <PrismCube id="cf" className="x-cube" />
              <Wordmark />
            </Link>
            <p>A web development agency building websites, web apps, e-commerce and APIs.</p>
            <a className="x-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <nav aria-label="Services">
            <h3>Services</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h3>Company</h3>
            <ul>
              {companyNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3>Social</h3>
            <div className="x-social">
              <SocialIcons items={socials} />
            </div>
            {placeholderSocials && <p>Links coming soon</p>}
          </div>
        </div>
        <div className="x-foot__row">
          <p className="x-foot__bottom">© {site.founded} {site.name}. All rights reserved.</p>
          <BackToTop />
        </div>
      </div>
      <FooterWordmark text={site.name} />
    </footer>
  );
}
