import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";

/**
 * Índice del blog. Cada artículo es un archivo MDX en content/blog/<idioma>/.
 * Para publicar uno nuevo: crea el .mdx, agrégalo aquí (con su cargador) y listo.
 * `translation` enlaza la versión en el otro idioma (para el selector de idioma y hreflang).
 */
export interface PostMeta {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 */
  date: string;
  readingMinutes: number;
  tags: string[];
  translation?: { locale: Locale; slug: string };
}

export const posts: PostMeta[] = [
  {
    locale: "es",
    slug: "como-operamos-catorce-portales",
    title: "Cómo operamos catorce sitios sobre una sola plataforma",
    description:
      "Un backend, un panel y catorce dominios. Lo que aprendimos al pasar de hacer sitios a operarlos todos los días sin que se contaminen entre sí.",
    date: "2026-09-29",
    readingMinutes: 6,
    tags: ["Arquitectura", "Operación"],
    translation: { locale: "en", slug: "how-we-run-fourteen-sites" },
  },
  {
    locale: "es",
    slug: "preguntas-antes-de-contratar-una-pagina-web",
    title: "10 preguntas antes de contratar una página web",
    description:
      "Lo que conviene preguntar (y dejar por escrito) antes de pagar por un sitio: dominio, accesos, respaldos, velocidad, mantenimiento y más.",
    date: "2026-09-29",
    readingMinutes: 5,
    tags: ["Guía", "Páginas web"],
    translation: { locale: "en", slug: "questions-before-hiring-a-web-developer" },
  },
  {
    locale: "en",
    slug: "how-we-run-fourteen-sites",
    title: "How we run fourteen sites on a single platform",
    description:
      "One backend, one admin panel and fourteen domains. What we learned going from building sites to running them every day without them contaminating each other.",
    date: "2026-09-29",
    readingMinutes: 6,
    tags: ["Architecture", "Operations"],
    translation: { locale: "es", slug: "como-operamos-catorce-portales" },
  },
  {
    locale: "en",
    slug: "questions-before-hiring-a-web-developer",
    title: "10 questions to ask before hiring a web developer",
    description:
      "What to ask (and get in writing) before paying for a website: domain, access, backups, speed, maintenance and more.",
    date: "2026-09-29",
    readingMinutes: 5,
    tags: ["Guide", "Websites"],
    translation: { locale: "es", slug: "preguntas-antes-de-contratar-una-pagina-web" },
  },
];

/** Cargadores estáticos: el empaquetador sabe exactamente qué MDX incluir. */
export const postLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  "es/como-operamos-catorce-portales": () => import("./es/como-operamos-catorce-portales.mdx"),
  "es/preguntas-antes-de-contratar-una-pagina-web": () => import("./es/preguntas-antes-de-contratar-una-pagina-web.mdx"),
  "en/how-we-run-fourteen-sites": () => import("./en/how-we-run-fourteen-sites.mdx"),
  "en/questions-before-hiring-a-web-developer": () => import("./en/questions-before-hiring-a-web-developer.mdx"),
};

/** Para el selector de idioma: cada artículo apunta a su traducción. */
export const blogPathAlternates: Record<string, string> = Object.fromEntries(
  posts
    .filter((p) => p.translation)
    .map((p) => [`${p.locale}:/blog/${p.slug}`, `/blog/${p.translation!.slug}`]),
);

export function postsFor(locale: Locale): PostMeta[] {
  return posts.filter((p) => p.locale === locale).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(locale: Locale, slug: string): PostMeta | undefined {
  return posts.find((p) => p.locale === locale && p.slug === slug);
}
