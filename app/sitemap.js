import { locales } from "@/lib/i18n/config";
import { urlInicio } from "@/lib/seo";

// Una entrada por idioma, cada una con las alternativas (hreflang).
export default function sitemap() {
  const languages = Object.fromEntries(locales.map((l) => [l, urlInicio(l)]));
  return locales.map((lang) => ({
    url: urlInicio(lang),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: lang === "es" ? 1.0 : 0.9,
    alternates: { languages },
  }));
}
