/**
 * Hora del día en Hermosillo → estado del cielo del Cerro.
 *
 * Sonora no cambia de horario: es UTC−7 todo el año, así que la hora local se
 * calcula con un desfase fijo (sin depender de las zonas horarias del navegador).
 * El amanecer y el atardecer llegan del clima (Open-Meteo); mientras tanto, o si
 * la API falla, se usa esta tabla mensual aproximada.
 *
 * Archivo puro (sin DOM ni Three.js): lo usan el widget, la escena y los tests.
 */

export const HMO_UTC_OFFSET_H = -7;
export const HMO_COORDS = { lat: 29.0729, lon: -110.9559 } as const;

/** [amanecer, atardecer] promedio de cada mes, en horas locales decimales. */
export const SUN_TABLE: readonly (readonly [number, number])[] = [
  [7.25, 17.75],
  [7.0, 18.17],
  [6.58, 18.5],
  [6.08, 18.75],
  [5.67, 19.08],
  [5.5, 19.33],
  [5.67, 19.33],
  [5.92, 19.0],
  [6.17, 18.5],
  [6.42, 17.92],
  [6.75, 17.42],
  [7.08, 17.42],
];

export type DayPhase = "night" | "dawn" | "day" | "dusk";

export interface SunTimes {
  /** Horas locales decimales (6.5 = 6:30). */
  sunrise: number;
  sunset: number;
}

/** Fecha "de pared" de Hermosillo: los campos UTC del Date devuelto son la hora local. */
export function hermosilloWallClock(now: Date = new Date()): Date {
  return new Date(now.getTime() + HMO_UTC_OFFSET_H * 3600_000);
}

/** Hora local de Hermosillo en horas decimales (0–24). */
export function hermosilloHours(now: Date = new Date()): number {
  const w = hermosilloWallClock(now);
  return w.getUTCHours() + w.getUTCMinutes() / 60 + w.getUTCSeconds() / 3600;
}

export function defaultSunTimes(now: Date = new Date()): SunTimes {
  const [sunrise, sunset] = SUN_TABLE[hermosilloWallClock(now).getUTCMonth()];
  return { sunrise, sunset };
}

/** "2026-09-30T06:14" (hora local que devuelve Open-Meteo) → 6.23 */
export function hoursFromLocalIso(iso: string | undefined | null): number | null {
  if (!iso) return null;
  const m = /T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return null;
  const h = Number(m[1]) + Number(m[2]) / 60;
  return Number.isFinite(h) ? h : null;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export interface SkyState {
  /** 0 = día pleno · 0.45 = hora dorada · 0.72 = hora azul · 1 = noche. */
  tod: number;
  /** Altura aproximada del sol en grados (negativa de noche). */
  sunAltitude: number;
  /** `true` antes de mediodía solar (el sol sale detrás del cerro). */
  morning: boolean;
  phase: DayPhase;
}

/**
 * Altura del sol con una curva seno entre amanecer y atardecer (máx. ~62°) y
 * otra, negativa, durante la noche. Suficiente para el color del cielo.
 */
export function sunAltitude(hours: number, { sunrise, sunset }: SunTimes): number {
  const dayLen = sunset - sunrise;
  const h = ((hours % 24) + 24) % 24;
  if (h >= sunrise && h <= sunset) return 62 * Math.sin((Math.PI * (h - sunrise)) / dayLen);
  const nightLen = 24 - dayLen;
  const since = h > sunset ? h - sunset : h + 24 - sunset;
  return -48 * Math.sin((Math.PI * since) / nightLen);
}

export function skyState(hours: number, sun: SunTimes): SkyState {
  const alt = sunAltitude(hours, sun);
  let tod: number;
  if (alt >= 12) tod = 0;
  else if (alt >= 0) tod = 0.45 * smooth(1 - alt / 12);
  else if (alt >= -6) tod = 0.45 + 0.27 * smooth(-alt / 6);
  else if (alt >= -14) tod = 0.72 + 0.28 * smooth((-alt - 6) / 8);
  else tod = 1;
  const noon = (sun.sunrise + sun.sunset) / 2;
  const h = ((hours % 24) + 24) % 24;
  const morning = h < noon;
  const phase: DayPhase = alt >= 8 ? "day" : alt >= -8 ? (morning ? "dawn" : "dusk") : "night";
  return { tod: clamp(tod), sunAltitude: alt, morning, phase };
}

/** Hora representativa de cada fase (para la línea de tiempo del widget). */
export function phaseHour(phase: DayPhase, sun: SunTimes): number {
  switch (phase) {
    // Justo en la salida/puesta del sol: el momento de más color.
    case "dawn":
      return sun.sunrise - 0.05;
    case "day":
      return (sun.sunrise + sun.sunset) / 2 - 0.5;
    case "dusk":
      return sun.sunset - 0.05;
    case "night":
      return 22.5;
  }
}

export const PHASES: DayPhase[] = ["dawn", "day", "dusk", "night"];

/**
 * Versión mínima para el script de arranque (se inyecta como texto en <head>):
 * marca <html data-tod="…"> antes del primer pintado para que el cielo de
 * respaldo salga del color correcto.
 */
export const todBootSnippet = `var _n=new Date(Date.now()-252e5),_h=_n.getUTCHours()+_n.getUTCMinutes()/60,_s=${JSON.stringify(
  SUN_TABLE,
)}[_n.getUTCMonth()];d.dataset.tod=_h<_s[0]-0.6||_h>_s[1]+0.9?"night":_h<_s[0]+0.9?"dawn":_h>_s[1]-1.1?"dusk":"day";`;
