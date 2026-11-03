import { localizar, porIdioma } from "@/lib/i18n/localizar";
import { hrefSeccion } from "@/lib/i18n/config";

// Navegación corta. Los enlaces llevan la ruta de la portada delante («/#id»
// o «/en#id») para que también funcionen desde la página 404. «Servicios» se
// muestra como menú desplegable con los servicios reales; su enlace lleva a
// la sección «Lo que construimos».
const secciones = [
  { id: "servicios", label: { es: "Servicios", en: "Services" } },
  { id: "portafolio", label: { es: "Portafolio", en: "Portfolio" } },
  { id: "contacto", label: { es: "Contacto", en: "Contact" } },
];

// CTA principal de la barra: abre WhatsApp directo en el chat con Northa
// (ver lib/whatsapp.js). El asistente se abre con su propio botón.
const cta = {
  label: { es: "Cuéntanos tu proyecto", en: "Tell us about your project" },
  short: { es: "Cuéntanos", en: "Tell us" },
};

export const getNav = porIdioma((locale) => ({
  navSections: localizar(secciones, locale).map((s) => ({ ...s, href: hrefSeccion(locale, s.id) })),
  ctaPrincipal: localizar(cta, locale),
}));
