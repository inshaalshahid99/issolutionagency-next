"use client";

/**
 * shadcn/ui-style Accordion built on Radix, styled with the preview's
 * `.x-faq` classes. Content is force-mounted so the CSS grid-rows
 * transition can animate open/close; closed panels are made inert.
 */
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("x-faq__item", className)} {...props} />;
}

export function AccordionTrigger({ className, children, index, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { index?: number }) {
  return (
    <AccordionPrimitive.Header asChild>
      <h3>
        <AccordionPrimitive.Trigger className={className} {...props}>
          {index !== undefined && (
            <span className="x-faq__n" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span>{children}</span>
          <span className="x-faq__i" aria-hidden="true" />
        </AccordionPrimitive.Trigger>
      </h3>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, open, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content> & { open: boolean }) {
  return (
    <AccordionPrimitive.Content forceMount className={cn("x-faq__a", className)} inert={!open} {...props}>
      <div>{children}</div>
    </AccordionPrimitive.Content>
  );
}
