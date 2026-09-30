import type { L, LList } from "@/lib/l10n";
import { flota } from "./gov";

/**
 * Trabajo en producción. Solo proyectos verificables que se pueden abrir hoy.
 *
 * Para agregar un proyecto de cliente: confirma que sigue en línea, que el
 * cliente autoriza mostrarlo y cambia `published` a `true`.
 */
export interface WorkItem {
  id: string;
  published: boolean;
  size: "wide" | "normal";
  kicker: L;
  title: L;
  body: L;
  facts: LList;
  /** Ruta interna, ancla o URL externa. */
  href?: string;
  /** Acción especial en vez de liga. */
  action?: "open-chat";
  ctaKey: "seeFleet" | "tryNort" | "seeCerro";
  visual: "fleet" | "chat" | "cerro";
}

export const work: WorkItem[] = [
  {
    id: "plataforma-municipal",
    published: true,
    size: "wide",
    kicker: { es: "Plataforma multi-cliente", en: "Multi-tenant platform" },
    title: {
      es: "Catorce portales, una sola plataforma.",
      en: "Fourteen portals, one platform.",
    },
    body: {
      es: "Un backend compartido, un panel único y catorce sitios con dominio propio. Lo difícil no fue hacer un sitio: fue operar catorce a la vez sin que se contaminen entre sí.",
      en: "One shared backend, a single admin panel and fourteen sites with their own domains. The hard part wasn't building a site: it was running fourteen at once without them contaminating each other.",
    },
    facts: {
      es: ["14 dominios .com.mx", "Aislamiento verificado por suite automatizada", "Alta de un cliente nuevo de punta a punta"],
      en: ["14 .com.mx domains", "Isolation verified by an automated suite", "End-to-end onboarding of new tenants"],
    },
    href: "/gobierno",
    ctaKey: "seeFleet",
    visual: "fleet",
  },
  {
    id: "nort",
    published: true,
    size: "normal",
    kicker: { es: "IA aplicada", en: "Applied AI" },
    title: { es: "Nort, asistente con IA.", en: "Nort, an AI assistant." },
    body: {
      es: "Responde dudas, califica el proyecto y te pasa a WhatsApp con el resumen listo. Está en esta misma página: pruébalo.",
      en: "Answers questions, qualifies the project and hands you to WhatsApp with the summary ready. It's on this very page: try it.",
    },
    facts: {
      es: ["Bilingüe", "Reglas claras y escalamiento a una persona"],
      en: ["Bilingual", "Clear rules and handoff to a person"],
    },
    action: "open-chat",
    ctaKey: "tryNort",
    visual: "chat",
  },
  {
    id: "cerro-3d",
    published: true,
    size: "normal",
    kicker: { es: "Identidad animada", en: "Animated identity" },
    title: { es: "El Cerro de la Campana, en código.", en: "Cerro de la Campana, in code." },
    body: {
      es: "El Cerro del inicio cambia con la hora y el clima de Hermosillo, renderizado en tu navegador.",
      en: "The Cerro on the home page follows Hermosillo's time and weather, rendered in your browser.",
    },
    facts: {
      es: ["Three.js", "Hora y clima en vivo"],
      en: ["Three.js", "Live time and weather"],
    },
    href: "/#inicio",
    ctaKey: "seeCerro",
    visual: "cerro",
  },
];

/* ------------------------------------------------------------------ */
/* Página /portfolio                                                  */
/* ------------------------------------------------------------------ */

export type ProjectCategory = "gobierno" | "empresas" | "producto";

/**
 * Proyecto del portafolio. Reglas:
 *  - Solo lo que está en línea hoy (`url`) o es producto propio verificable.
 *  - Un proyecto de cliente privado entra con `published: true` SOLO con su autorización.
 *  - `screenshot`: ruta sin extensión; se sirven `.avif` y `.webp` (800 px de ancho,
 *    captura alta para el desplazamiento al pasar el cursor). Ver docs/06-contenido.md.
 */
export interface Project {
  id: string;
  category: ProjectCategory;
  published: boolean;
  title: L;
  summary: L;
  tags: LList;
  /** Sitio en vivo (externo). */
  url?: string;
  /** Página interna relacionada (ruta sin idioma). */
  href?: string;
  action?: "open-chat";
  screenshot?: string;
  /** Escudo o logotipo que acompaña la captura. */
  logo?: string;
}

const govProjects: Project[] = flota.map((m) => ({
  id: m.slug,
  category: "gobierno",
  published: true,
  title: { es: `Municipio de ${m.nombre}`, en: `Municipality of ${m.nombre}` },
  summary: {
    es: "Portal institucional y de transparencia con dominio propio. El ayuntamiento publica su contenido desde el panel de Northa.",
    en: "Institutional and transparency portal with its own domain. The municipality publishes its own content from Northa's admin panel.",
  },
  tags: {
    es: ["Transparencia", "Gobierno", "Turismo", ...(m.amplia ? ["Con Amplía"] : [])],
    en: ["Transparency", "Government", "Tourism", ...(m.amplia ? ["With Amplía"] : [])],
  },
  url: `https://${m.dominio}/`,
  screenshot: `/portfolio/${m.slug}`,
  logo: `/escudos/${m.slug}.png`,
}));

const ownProducts: Project[] = [
  {
    id: "nort",
    category: "producto",
    published: true,
    title: { es: "Nort, asistente con IA", en: "Nort, AI assistant" },
    summary: {
      es: "Responde dudas con el contenido real del sitio, califica el proyecto y pasa a WhatsApp con el resumen listo. Está en esta misma página.",
      en: "Answers questions with the site's real content, qualifies the project and hands off to WhatsApp with the summary ready. It's on this very page.",
    },
    tags: { es: ["Vercel AI SDK", "Herramientas", "Bilingüe"], en: ["Vercel AI SDK", "Tools", "Bilingual"] },
    action: "open-chat",
  },
  {
    id: "cerro-3d",
    category: "producto",
    published: true,
    title: { es: "El Cerro de la Campana, en código", en: "Cerro de la Campana, in code" },
    summary: {
      es: "El Cerro en vivo del inicio: amanece, atardece y anochece con la hora real de Hermosillo, con nubes según el clima.",
      en: "The live Cerro on the home page: sunrise, sunset and night follow Hermosillo's real time, with clouds from the weather.",
    },
    tags: { es: ["Three.js", "Open-Meteo", "Tiempo real"], en: ["Three.js", "Open-Meteo", "Real time"] },
    href: "/#inicio",
  },
];

/** Casos de clientes privados: agrégalos aquí con `published: true` cuando haya autorización. */
const businessProjects: Project[] = [];

export const projects: Project[] = [...govProjects, ...ownProducts, ...businessProjects].filter((p) => p.published);
