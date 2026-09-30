import type { Locale } from "@/lib/i18n/config";

/** Códigos WMO de Open-Meteo → tipo de ícono y descripción. */
export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "storm" | "snow";

export function weatherKind(code: number): WeatherKind {
  if (code === 0 || code === 1) return code === 0 ? "clear" : "partly";
  if (code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "partly";
}

const labels: Record<WeatherKind, Record<Locale, string>> = {
  clear: { es: "Despejado", en: "Clear" },
  partly: { es: "Parcialmente nublado", en: "Partly cloudy" },
  cloudy: { es: "Nublado", en: "Cloudy" },
  fog: { es: "Neblina", en: "Fog" },
  drizzle: { es: "Llovizna", en: "Drizzle" },
  rain: { es: "Lluvia", en: "Rain" },
  storm: { es: "Tormenta", en: "Storm" },
  snow: { es: "Nieve", en: "Snow" },
};

export function weatherLabel(code: number, locale: Locale): string {
  return labels[weatherKind(code)][locale];
}

/** Nubosidad (0–1) para el cielo del Cerro, a partir del código y la cobertura. */
export function cloudAmount(code: number, cover: number): number {
  const kind = weatherKind(code);
  const base = Math.min(1, Math.max(0, cover / 100));
  const floor = kind === "cloudy" || kind === "rain" || kind === "storm" ? 0.85 : kind === "partly" ? 0.4 : kind === "fog" || kind === "drizzle" ? 0.7 : 0;
  return Math.max(base, floor);
}

export function isRain(code: number): boolean {
  const kind = weatherKind(code);
  return kind === "rain" || kind === "storm" || kind === "drizzle";
}
