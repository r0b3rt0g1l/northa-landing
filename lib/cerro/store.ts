"use client";

import { useSyncExternalStore } from "react";
import type { ClimaResponse } from "@/app/api/clima/route";
import {
  defaultSunTimes,
  hermosilloHours,
  phaseHour,
  skyState,
  type DayPhase,
  type SkyState,
  type SunTimes,
} from "./sky-time";
import { cloudAmount, isRain } from "./weather";

/**
 * Estado compartido del inicio: la hora de Hermosillo (tic cada segundo), el
 * clima (de /api/clima, cada 10 min) y la fase que la persona quiera ver en la
 * línea de tiempo. La barra del hero lo muestra y la escena 3D lo pinta.
 */

type Weather = NonNullable<ClimaResponse["weather"]>;

export interface CerroSnapshot {
  now: number;
  weather: Weather | null;
  /** Fase elegida en la línea de tiempo (null = hora real). */
  preview: DayPhase | null;
}

let state: CerroSnapshot = { now: 0, weather: null, preview: null };
const listeners = new Set<() => void>();
let clock: ReturnType<typeof setInterval> | null = null;
let weatherTimer: ReturnType<typeof setTimeout> | null = null;
let fetched = false;

function emit() {
  listeners.forEach((l) => l());
}

function tick() {
  state = { ...state, now: Date.now() };
  emit();
}

async function loadWeather() {
  try {
    const res = await fetch("/api/clima");
    if (res.ok) {
      const json = (await res.json()) as ClimaResponse;
      state = { ...state, weather: json.weather };
      emit();
    }
  } catch {
    // Sin clima: la hora y el cielo siguen con la tabla de amaneceres.
  }
  weatherTimer = setTimeout(loadWeather, 10 * 60_000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!clock) {
    tick();
    clock = setInterval(tick, 1000);
  }
  if (!fetched) {
    fetched = true;
    const start = () => void loadWeather();
    if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 3000 });
    else setTimeout(start, 1500);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (clock) clearInterval(clock);
      clock = null;
      if (weatherTimer) clearTimeout(weatherTimer);
      weatherTimer = null;
      fetched = false;
    }
  };
}

const serverSnapshot: CerroSnapshot = { now: 0, weather: null, preview: null };

export function useCerro(): CerroSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}

export function setPreview(preview: DayPhase | null) {
  state = { ...state, preview };
  emit();
}

export function sunTimesOf(snapshot: CerroSnapshot): SunTimes {
  const fallback = defaultSunTimes(snapshot.now ? new Date(snapshot.now) : new Date());
  const w = snapshot.weather;
  return {
    sunrise: w?.sunrise ?? fallback.sunrise,
    sunset: w?.sunset ?? fallback.sunset,
  };
}

export interface CerroSky extends SkyState {
  hours: number;
  cloud: number;
  rain: boolean;
  live: boolean;
}

/** Cielo que debe pintarse: la hora real, o la fase elegida en la línea de tiempo. */
export function skyOf(snapshot: CerroSnapshot): CerroSky {
  const sun = sunTimesOf(snapshot);
  const now = snapshot.now ? new Date(snapshot.now) : new Date();
  const hours = snapshot.preview ? phaseHour(snapshot.preview, sun) : hermosilloHours(now);
  const w = snapshot.weather;
  return {
    ...skyState(hours, sun),
    hours,
    cloud: w ? cloudAmount(w.code, w.cloudCover) : 0.1,
    rain: w ? isRain(w.code) : false,
    live: !snapshot.preview,
  };
}
