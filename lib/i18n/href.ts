import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * Convierte una ruta interna ("/", "/servicios/desarrollo-web", "/#contacto")
 * en la ruta pública del idioma. El español no lleva prefijo.
 */
export function href(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  if (clean === "/") return `/${locale}`;
  if (clean.startsWith("/#")) return `/${locale}${clean.slice(1)}`;
  return `/${locale}${clean}`;
}

/** Separa el idioma de una ruta pública: "/en/blog" → { locale: "en", path: "/blog" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = (pathname || "/").split("/");
  // Acepta tanto la ruta pública ("/servicios", "/en/servicios") como la
  // interna reescrita por proxy.ts ("/es/servicios").
  if (isLocale(first)) {
    const path = `/${rest.join("/")}`;
    return { locale: first, path: path === "/" ? "/" : path.replace(/\/$/, "") };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}

/**
 * Rutas cuyo slug cambia entre idiomas (artículos del blog):
 * clave `${idioma}:${ruta}` → ruta equivalente en el otro idioma.
 */
export type PathAlternates = Record<string, string>;

/** Misma página en el otro idioma (respeta los slugs traducidos del blog). */
export function switchLocaleHref(pathname: string, target: Locale, alternates?: PathAlternates): string {
  const { locale, path } = splitLocale(pathname);
  if (locale === target) return href(target, path);
  const mapped = alternates?.[`${locale}:${path}`];
  if (mapped) return href(target, mapped);
  // Artículo sin traducción: al índice del blog del otro idioma.
  if (path.startsWith("/blog/")) return href(target, "/blog");
  return href(target, path);
}

/** URL absoluta para metadatos (canonical, hreflang, sitemap). */
export function absoluteUrl(siteUrl: string, locale: Locale, path: string = "/"): string {
  const p = href(locale, path);
  return `${siteUrl.replace(/\/$/, "")}${p === "/" ? "" : p}` || siteUrl;
}
