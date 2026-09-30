import "server-only";
import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale, type Locale } from "./config";
import es, { type Dictionary } from "./dictionaries/es";
import en from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { es, en };

/** Idioma de la ruta actual, leído del segmento raíz `[locale]` sin pasar props. */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale();
  return isLocale(value) ? value : defaultLocale;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
