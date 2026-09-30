import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Props para una sección que está debajo del primer pantallazo: el navegador no
 * calcula su estilo, layout ni pintura hasta que se acerca a la pantalla
 * (`content-visibility: auto`, ver globals.css). Baja mucho el trabajo del
 * primer cuadro en páginas largas. `mobile` y `desktop` son alturas estimadas
 * en px: solo afectan la barra de scroll antes de que la sección se pinte.
 * No usar en secciones visibles al cargar.
 */
export function deferRender(mobile: number, desktop: number) {
  return {
    "data-defer": "",
    style: { "--cv-h": `${mobile}px`, "--cv-h-lg": `${desktop}px` } as React.CSSProperties,
  };
}

/** Recorta un texto sin cortar palabras. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trimEnd()}…`;
}

export function formatDate(iso: string, locale: "es" | "en"): string {
  // "2026-09-29" (solo fecha) se interpreta como medianoche UTC; en Hermosillo (UTC−7)
  // eso ya es el día anterior. Las fechas sin hora se formatean en UTC tal cual.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: dateOnly ? "UTC" : "America/Hermosillo",
  }).format(new Date(iso));
}
