import "server-only";
import { tool } from "ai";
import { z } from "zod";
import type { Locale } from "@/lib/i18n/config";
import { deliverLead } from "@/lib/leads/deliver";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Herramientas de Nort. La UI dibuja una tarjeta por cada una (components/chat/ToolCard.tsx). */
export function nortTools(locale: Locale, page?: string) {
  const prefix = locale === "es" ? "Hola Northa 👋 Vengo de Nort." : "Hi Northa 👋 Nort sent me.";
  return {
    whatsappHandoff: tool({
      description:
        "Genera un enlace de WhatsApp con un resumen del proyecto ya escrito para continuar con una persona del equipo. Úsala cuando la persona quiera cotizar, hablar con alguien o avanzar.",
      inputSchema: z.object({
        summary: z
          .string()
          .min(10)
          .max(600)
          .describe("Resumen en primera persona de lo que necesita la persona, en su idioma, listo para enviarse."),
      }),
      execute: async ({ summary }) => ({ url: whatsappUrl(`${prefix}\n${summary}`), summary }),
    }),

    saveLead: tool({
      description:
        "Guarda los datos de contacto para que el equipo contacte a la persona. SOLO después de que la persona dio su nombre, un correo o teléfono y aceptó explícitamente ser contactada.",
      inputSchema: z.object({
        name: z.string().min(2).max(80),
        email: z.email().max(120).optional(),
        phone: z.string().min(7).max(25).optional(),
        company: z.string().max(120).optional(),
        service: z.string().max(80).optional(),
        summary: z.string().min(10).max(1200).describe("Qué necesita, para cuándo y detalles útiles."),
        consent: z.literal(true).describe("true únicamente si la persona aceptó de forma explícita que la contacten."),
      }),
      execute: async (input) => {
        if (!input.email && !input.phone) {
          return { ok: false as const, delivered: false, reason: "missing_contact", whatsappUrl: null };
        }
        const result = await deliverLead({
          name: input.name,
          email: input.email ?? "",
          phone: input.phone ?? "",
          company: input.company,
          service: input.service,
          message: input.summary,
          locale,
          source: "chat",
          page,
          consent: true,
        });
        return {
          ok: true as const,
          delivered: result.delivered,
          reason: null,
          whatsappUrl: whatsappUrl(`${prefix}\n${input.name}: ${input.summary}`),
        };
      },
    }),

    bookCall: tool({
      description: "Devuelve la liga para agendar una videollamada con el equipo, si existe.",
      inputSchema: z.object({}),
      execute: async () => ({ url: site.calUrl || null }),
    }),
  };
}

export type NortTools = ReturnType<typeof nortTools>;
