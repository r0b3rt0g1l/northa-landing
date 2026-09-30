import type { L } from "@/lib/l10n";

/**
 * Preguntas frecuentes (las cuatro que eligió Roberto el 30-sep-2026).
 * Respuestas de una línea. Se publican también como datos estructurados FAQPage.
 */
export const faq: { q: L; a: L }[] = [
  {
    q: { es: "¿Qué necesito para empezar?", en: "What do I need to get started?" },
    a: {
      es: "Solo una conversación: cuéntanos tu idea por WhatsApp o con Nort y te mandamos una propuesta.",
      en: "Just a conversation: tell us your idea on WhatsApp or through Nort and we'll send you a proposal.",
    },
  },
  {
    q: { es: "¿Podré actualizarlo yo?", en: "Can I update it myself?" },
    a: {
      es: "Sí. Con un panel administrador, tu equipo publica textos, fotos y documentos por su cuenta.",
      en: "Yes. With an admin panel, your team publishes copy, photos and documents on its own.",
    },
  },
  {
    q: { es: "¿Trabajan fuera de Hermosillo?", en: "Do you work outside Hermosillo?" },
    a: {
      es: "Sí. Estamos en Hermosillo y trabajamos a distancia con clientes de todo Sonora.",
      en: "Yes. We're based in Hermosillo and work remotely with clients across Sonora.",
    },
  },
  {
    q: { es: "¿Nort es una persona?", en: "Is Nort a person?" },
    a: {
      es: "No, es un asistente con inteligencia artificial. Cuando hace falta, te pasa con el equipo por WhatsApp.",
      en: "No, it's an artificial intelligence assistant. When needed, it hands you over to the team on WhatsApp.",
    },
  },
];
