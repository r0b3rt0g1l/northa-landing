/**
 * Configuración de idiomas.
 *
 * Decisión: el español vive en la raíz (`/`, `/servicios`) y el inglés con
 * prefijo (`/en`, `/en/servicios`). Los slugs se quedan en español en ambos
 * idiomas: el mercado principal es Sonora y así el cambio de idioma es solo
 * agregar o quitar `/en`, sin tablas de traducción de rutas que se desincronicen.
 * El ruteo lo resuelve `proxy.ts`.
 */
export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Valor para `<html lang>` y `hreflang`. */
export const htmlLang: Record<Locale, string> = {
  es: "es-MX",
  en: "en",
};

/** Valor para `og:locale`. */
export const ogLocale: Record<Locale, string> = {
  es: "es_MX",
  en: "en_US",
};

export const localeLabel: Record<Locale, { short: string; long: string }> = {
  es: { short: "ES", long: "Español" },
  en: { short: "EN", long: "English" },
};
