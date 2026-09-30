import type { L } from "@/lib/l10n";

/** Preguntas frecuentes generales del home. Se publican también como datos estructurados FAQPage. */
export const faq: { q: L; a: L }[] = [
  {
    q: { es: "¿Cuánto cuesta un proyecto?", en: "How much does a project cost?" },
    a: {
      es: "Depende del alcance. Cotizamos por proyecto y te entregamos por escrito qué incluye, en cuánto tiempo y cuánto cuesta, antes de empezar.",
      en: "It depends on scope. We quote per project and give you in writing what's included, how long it takes and what it costs, before starting.",
    },
  },
  {
    q: { es: "¿Cuánto tardan?", en: "How long does it take?" },
    a: {
      es: "De la idea al lanzamiento en semanas, no meses, para la mayoría de los sitios. Los sistemas grandes se entregan por fases para que empieces a usarlos pronto.",
      en: "From idea to launch in weeks, not months, for most websites. Larger systems ship in phases so you can start using them early.",
    },
  },
  {
    q: { es: "¿Qué necesito para empezar?", en: "What do I need to get started?" },
    a: {
      es: "Una conversación. Con lo que nos cuentes por WhatsApp o con Nort armamos una propuesta; los textos, fotos y accesos se definen juntos después.",
      en: "A conversation. From what you tell us on WhatsApp or through Nort we put together a proposal; copy, photos and access are sorted out together afterwards.",
    },
  },
  {
    q: { es: "¿Podré actualizar mi sitio sin depender de ustedes?", en: "Can I update my site without depending on you?" },
    a: {
      es: "Sí, cuando el proyecto incluye panel de administración: tu equipo publica textos, imágenes y documentos por su cuenta.",
      en: "Yes, when the project includes an admin panel: your team publishes copy, images and documents on its own.",
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
      es: "No: Nort es un asistente con inteligencia artificial. Responde dudas generales y, cuando hace falta, te pasa con el equipo por WhatsApp.",
      en: "No: Nort is an artificial intelligence assistant. It answers general questions and, when needed, hands you over to the team on WhatsApp.",
    },
  },
];
