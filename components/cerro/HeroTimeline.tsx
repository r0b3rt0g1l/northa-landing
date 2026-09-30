"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { PHASES, type DayPhase } from "@/lib/cerro/sky-time";
import { setPreview, skyOf, sunTimesOf, useCerro } from "@/lib/cerro/store";
import { weatherKind, weatherLabel, type WeatherKind } from "@/lib/cerro/weather";
import { cn } from "@/lib/utils";

export interface HeroTimelineLabels {
  city: string;
  live: string;
  backToNow: string;
  group: string;
  phases: Record<DayPhase, string>;
}

const phaseIcons: Record<DayPhase, LucideIcon> = { dawn: Sunrise, day: Sun, dusk: Sunset, night: Moon };

function WeatherIcon({ kind, night, className }: { kind: WeatherKind; night: boolean; className?: string }) {
  const props = { className, "aria-hidden": true } as const;
  switch (kind) {
    case "clear":
      return night ? <Moon {...props} /> : <Sun {...props} />;
    case "partly":
      return night ? <CloudMoon {...props} /> : <CloudSun {...props} />;
    case "cloudy":
      return <Cloudy {...props} />;
    case "fog":
      return <CloudFog {...props} />;
    case "drizzle":
      return <CloudDrizzle {...props} />;
    case "rain":
      return <CloudRain {...props} />;
    case "storm":
      return <CloudLightning {...props} />;
    case "snow":
      return <CloudSnow {...props} />;
    default:
      return <Cloud {...props} />;
  }
}

/**
 * Barra del hero: lugar, hora y clima de Hermosillo en tiempo real, y una línea
 * de tiempo para ver el Cerro al amanecer, de día, al atardecer o de noche.
 * La escena 3D lee el mismo estado (lib/cerro/store.ts).
 */
export function HeroTimeline({ locale, labels }: { locale: Locale; labels: HeroTimelineLabels }) {
  const snapshot = useCerro();
  const sky = skyOf(snapshot);
  const sun = sunTimesOf(snapshot);
  const intl = locale === "es" ? "es-MX" : "en-US";
  const date = snapshot.now ? new Date(snapshot.now) : null;
  const time = date
    ? new Intl.DateTimeFormat(intl, { timeZone: "America/Hermosillo", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(date)
    : "––:––";
  // En celular, sin segundos: cabe todo en un renglón.
  const shortTime = date
    ? new Intl.DateTimeFormat(intl, { timeZone: "America/Hermosillo", hour: "numeric", minute: "2-digit" }).format(date)
    : "––:––";
  const day = date
    ? new Intl.DateTimeFormat(intl, { timeZone: "America/Hermosillo", weekday: "short", day: "numeric", month: "short" }).format(date)
    : "";
  const w = snapshot.weather;
  const activePhase = snapshot.preview ?? sky.phase;
  // Posición de "ahora" y del día en la barra de 24 h.
  const nowPct = (sky.live ? sky.hours : 0) / 24;
  const dayStart = sun.sunrise / 24;
  const dayEnd = sun.sunset / 24;

  return (
    <div className="hero-fade w-full rounded-[1.4rem] border border-white/15 bg-[rgb(10_17_36/0.68)] p-2 text-white shadow-[0_20px_60px_-30px_rgb(0_0_0/0.8)] backdrop-blur-xl [--d:760ms] md:w-auto md:rounded-full">
      {/* Celular: 2 renglones (lugar, hora y clima arriba; fases y "en vivo" abajo).
          Escritorio: una sola píldora. Posiciones explícitas: en el grid, los
          elementos con renglón fijo se acomodan antes que los demás. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-1 gap-y-2 md:flex md:gap-1">
        {/* Lugar, hora y clima */}
        <div className="col-span-2 row-start-1 flex min-w-0 items-center gap-2.5 px-2 py-1 text-sm sm:gap-3 sm:px-3 md:py-0">
          <span className="inline-flex items-center gap-1.5 text-white/90">
            <MapPin className="size-3.5 text-accent-2" aria-hidden />
            <span className="max-[359px]:sr-only">{labels.city}</span>
          </span>
          <span aria-hidden className="h-3.5 w-px bg-white/20" />
          <span className="font-mono text-[0.82rem] tabular-nums text-white">
            <time dateTime={date?.toISOString()} suppressHydrationWarning>
              <span className="max-md:hidden">{time}</span>
              <span className="md:hidden">{shortTime}</span>
            </time>
            {day && <span className="ml-2 hidden text-white/75 lg:inline">{day}</span>}
          </span>
          {w && (
            <>
              <span aria-hidden className="h-3.5 w-px bg-white/20" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <WeatherIcon kind={weatherKind(w.code)} night={!w.isDay} className="size-4 text-accent-2" />
                <span className="font-semibold tabular-nums">{Math.round(w.temperature)}°C</span>
                <span className="hidden text-white/80 xl:inline">{weatherLabel(w.code, locale)}</span>
              </span>
            </>
          )}
        </div>

        {/* Línea de tiempo del día */}
        <div
          className="relative col-start-1 row-start-2 flex items-center gap-1 rounded-full bg-white/[0.06] p-1"
          role="group"
          aria-label={labels.group}
        >
          {PHASES.map((phase) => {
            const Icon = phaseIcons[phase];
            const active = activePhase === phase;
            return (
              <button
                key={phase}
                type="button"
                aria-pressed={active}
                onClick={() => setPreview(sky.live && sky.phase === phase ? null : phase)}
                className={cn(
                  "relative inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[0.8rem] font-semibold transition-colors md:flex-none",
                  active ? "bg-accent-strong text-accent-contrast" : "text-white/85 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span className="max-sm:sr-only">{labels.phases[phase]}</span>
              </button>
            );
          })}
          {/* Barra de 24 h: día en naranja, noche en marino, y el punto de "ahora". */}
          <span aria-hidden className="pointer-events-none absolute inset-x-4 -bottom-1.5 h-[3px] overflow-hidden rounded-full bg-[#2f3f6b]">
            <span className="absolute inset-y-0 bg-accent/70" style={{ left: `${dayStart * 100}%`, width: `${(dayEnd - dayStart) * 100}%` }} />
          </span>
          {sky.live && snapshot.now > 0 && (
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-[9px] size-2.5 -translate-x-1/2 rounded-full border-2 border-[#0a1124] bg-white"
              style={{ left: `calc(1rem + (100% - 2rem) * ${nowPct})` }}
            />
          )}
        </div>

        {/* En vivo / volver a la hora real */}
        <div className="col-start-2 row-start-2 flex items-center justify-end px-1 md:justify-start md:px-2">
          {sky.live ? (
            <span className="inline-flex items-center gap-2 px-2 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-white/85">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              {labels.live}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="inline-flex h-8 items-center gap-2 rounded-full border border-white/20 px-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-white/50 md:h-9"
            >
              <span className="size-2 rounded-full bg-accent" />
              {labels.backToNow}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
