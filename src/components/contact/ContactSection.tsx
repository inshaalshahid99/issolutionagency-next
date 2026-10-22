import { contactCopy } from "@/content/home";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { BigHeadline } from "./BigHeadline";

export function ContactSection({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <section className="x-sec" id="contact">
      <div className="x-blob x-blob--a" style={{ top: "20%", left: "30%", opacity: 0.2 }} />
      <div className="x-wrap">
        <BigHeadline kicker={contactCopy.kicker} headline={contactCopy.headline} as={headingAs} />
        <div className="x-panel x-reveal">
          <div>
            <p className="x-eyebrow">Contact</p>
            <p>{contactCopy.intro}</p>
            <p>
              Prefer email?{" "}
              <a className="x-more" href={`mailto:${site.email}`} style={{ margin: 0 }}>
                {site.email}
              </a>
            </p>
          </div>
          <div className="x-formwrap">
            <div className="x-halo" aria-hidden="true" />
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
