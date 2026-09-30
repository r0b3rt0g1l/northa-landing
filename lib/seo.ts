import type { Metadata } from "next";
import { site } from "./site";
import { htmlLang, locales, ogLocale, type Locale } from "./i18n/config";
import { absoluteUrl } from "./i18n/href";
import { getDictionary } from "./i18n/get-dictionary";

/** hreflang para una ruta interna, en ambos idiomas + x-default (español). */
export function languageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = absoluteUrl(site.url, l, path);
  languages["x-default"] = absoluteUrl(site.url, "es", path);
  return languages;
}

export function ogImageUrl({
  title,
  subtitle,
  locale,
  brand = "northa",
}: {
  title: string;
  subtitle?: string;
  locale: Locale;
  brand?: "northa" | "amplia";
}) {
  const params = new URLSearchParams({ title, locale, brand });
  if (subtitle) params.set("subtitle", subtitle);
  return `${site.url}/api/og?${params.toString()}`;
}

/**
 * Metadatos completos de una página: título, descripción, canonical,
 * hreflang, Open Graph (con imagen generada) y Twitter.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogSubtitle,
  brand = "northa",
  type = "website",
  noIndex = false,
  publishedTime,
}: {
  locale: Locale;
  path: string;
  /** Sin sufijo: la plantilla del layout agrega "· Northa Digital". Omitir en el home. */
  title?: string;
  description?: string;
  ogSubtitle?: string;
  brand?: "northa" | "amplia";
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
}): Metadata {
  const dict = getDictionary(locale);
  const fullTitle = title ? dict.meta.titleTemplate.replace("%s", title) : dict.meta.defaultTitle;
  const desc = description ?? dict.meta.description;
  const url = absoluteUrl(site.url, locale, path);
  const image = ogImageUrl({
    title: title ?? `${site.tagline[locale]}.`,
    subtitle: ogSubtitle ?? (title ? undefined : site.subtagline[locale]),
    locale,
    brand,
  });

  return {
    title: title ?? { absolute: dict.meta.defaultTitle },
    description: desc,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      title: fullTitle,
      description: desc,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
