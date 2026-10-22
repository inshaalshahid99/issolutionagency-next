import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120, "Please keep your name under 120 characters."),
  email: z.string().trim().min(1, "Please enter a valid email address.").email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().min(1, "Please choose a service.").max(120),
  budget: z.string().trim().min(1, "Please choose a budget range.").max(60),
  message: z.string().trim().min(1, "Please tell us a little about your project.").max(5000, "Please keep your message under 5,000 characters."),
  /** Honeypot: real people never fill this hidden field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
