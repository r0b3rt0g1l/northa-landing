import { localizar, porIdioma } from "@/lib/i18n/localizar";

// Hero: una sola idea. El subtítulo está medido para ocupar dos líneas.
const base = {
  etiqueta: { es: "Estudio digital", en: "Digital studio" },
  titulo: { es: "Un norte claro en lo digital.", en: "A clear north in the digital world." },
  subtitulo: {
    es: "Creamos portales municipales, sitios web y soluciones digitales que generan confianza.",
    en: "We build municipal portals, websites and digital solutions that earn trust.",
  },
};

export const getHero = porIdioma((locale) => localizar(base, locale));
