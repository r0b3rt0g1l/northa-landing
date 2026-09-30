import { z } from "zod";

/** Un lead que llega del formulario, del chat de Nort o de "Arma tu proyecto". */
export const leadSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.union([z.email().max(120), z.literal("")]).optional(),
    phone: z
      .union([z.string().trim().regex(/^[+()\d\s.-]{7,25}$/), z.literal("")])
      .optional(),
    company: z.string().trim().max(120).optional(),
    service: z.string().trim().max(80).optional(),
    message: z.string().trim().min(10).max(2000),
    locale: z.enum(["es", "en"]).default("es"),
    source: z.enum(["form", "chat", "scope"]).default("form"),
    page: z.string().max(200).optional(),
    consent: z.literal(true),
    /** Honeypot: los bots lo llenan, las personas no lo ven. */
    website: z.string().max(0).optional(),
  })
  .refine((d) => !!(d.email && d.email.length) || !!(d.phone && d.phone.length), {
    message: "contact",
    path: ["email"],
  });

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export type SinkStatus = "ok" | "skipped" | "error";
