import type { L } from "@/lib/l10n";

/**
 * Proceso — basado en northa-landing/lib/content/proceso.js, con una etapa más
 * ("Construimos") y un rumbo de brújula por etapa: la vuelta completa termina
 * otra vez en el norte (acompañamiento).
 */
export const processSteps: { bearing: number; heading: L; title: L; body: L }[] = [
  {
    bearing: 0,
    heading: { es: "N", en: "N" },
    title: { es: "Conversamos", en: "We talk" },
    body: {
      es: "Entendemos tu negocio, tus prioridades y a quién necesitas servir.",
      en: "We understand your business, your priorities and who you need to serve.",
    },
  },
  {
    bearing: 90,
    heading: { es: "E", en: "E" },
    title: { es: "Diseñamos", en: "We design" },
    body: {
      es: "Definimos la estructura, la identidad y la experiencia, con prototipos que revisas desde tu celular.",
      en: "We define structure, identity and experience, with prototypes you review on your phone.",
    },
  },
  {
    bearing: 180,
    heading: { es: "S", en: "S" },
    title: { es: "Construimos", en: "We build" },
    body: {
      es: "Desarrollamos por entregas cortas y probamos cada cambio en celulares reales antes de publicarlo.",
      en: "We build in short iterations and test every change on real phones before publishing it.",
    },
  },
  {
    bearing: 270,
    heading: { es: "O", en: "W" },
    title: { es: "Lanzamos", en: "We launch" },
    body: {
      es: "Publicamos un sitio rápido, seguro y accesible, verificado sobre la URL real donde lo verán tus clientes.",
      en: "We publish a fast, secure and accessible site, verified on the real URL your customers will see.",
    },
  },
  {
    bearing: 360,
    heading: { es: "N", en: "N" },
    title: { es: "Acompañamos", en: "We stay" },
    body: {
      es: "Seguimos a tu lado después del lanzamiento para que todo siga impecable.",
      en: "We stay with you after launch so everything keeps running flawlessly.",
    },
  },
];
