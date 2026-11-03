import { getSite, site } from "./site";
import { locales, ogLocale, rutaInicio } from "./i18n/config";

/** URL absoluta de la portada en un idioma: «…/» o «…/en». */
export const urlInicio = (locale) => `${site.url}${rutaInicio(locale) === "/" ? "/" : "/en"}`;

export function buildMetadata(locale = "es") {
  const s = getSite(locale);
  const title = `${s.name} · ${s.tagline}`;
  const description = s.description;
  const url = urlInicio(locale);

  return {
    title,
    description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: url,
      // Cada idioma apunta a su equivalente; x-default es el español.
      languages: { ...Object.fromEntries(locales.map((l) => [l, urlInicio(l)])), "x-default": urlInicio("es") },
    },
    keywords: s.keywords,
    authors: [{ name: s.founder }],
    creator: s.name,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      url,
      siteName: s.name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const defaultViewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
};
