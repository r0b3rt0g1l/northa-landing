import type { Locale } from "./i18n/config";

/** Texto con sus dos versiones. El contenido editable usa este tipo. */
export type L = { es: string; en: string };

/** Lista con sus dos versiones. */
export type LList = { es: string[]; en: string[] };

export function t(value: L, locale: Locale): string {
  return value[locale];
}

export function tl(value: LList, locale: Locale): string[] {
  return value[locale];
}
