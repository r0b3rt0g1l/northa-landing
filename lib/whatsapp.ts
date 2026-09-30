import { site } from "./site";
import type { Locale } from "./i18n/config";

/** Liga wa.me con mensaje pre-llenado. */
export function whatsappUrl(message?: string, number: string = site.contact.whatsappNumber): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message.slice(0, 1500))}` : base;
}

/** Mensajes base por contexto. Se mantienen cortos: la persona los edita antes de enviar. */
export const whatsappMessages = {
  general: {
    es: "Hola Northa 👋 Vengo de su sitio web y me gustaría cotizar un proyecto.",
    en: "Hi Northa 👋 I found you through your website and I'd like a quote for a project.",
  },
  gov: {
    es: "Hola Northa 👋 Escribo de parte de un ayuntamiento y nos interesa un portal municipal.",
    en: "Hi Northa 👋 I'm writing on behalf of a municipality interested in a government portal.",
  },
} satisfies Record<string, Record<Locale, string>>;

export function serviceWhatsappMessage(serviceName: string, locale: Locale): string {
  return locale === "es"
    ? `Hola Northa 👋 Me interesa: ${serviceName}. ¿Podemos platicar?`
    : `Hi Northa 👋 I'm interested in: ${serviceName}. Can we talk?`;
}
