"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Full-width FAQ accordion (one open at a time, arrow/Home/End keys between questions). */
export function Faq({ items, title = "Questions, answered", eyebrow = "FAQ", id = "faq", alt = true }: { items: { q: string; a: string }[]; title?: string; eyebrow?: string; id?: string; alt?: boolean }) {
  const [open, setOpen] = useState("");
  return (
    <section className={`x-sec${alt ? " x-sec--alt" : ""}`} id={id}>
      <div className="x-wrap">
        <SectionHeading eyebrow={eyebrow} title={title} className="x-head x-reveal" />
        <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="x-faq x-reveal" id="x-faq">
          {items.map((f, i) => {
            const v = `q${i}`;
            return (
              <AccordionItem key={v} value={v} className={open === v ? "is-open" : undefined}>
                <AccordionTrigger index={i}>{f.q}</AccordionTrigger>
                <AccordionContent open={open === v}>
                  <p>{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
