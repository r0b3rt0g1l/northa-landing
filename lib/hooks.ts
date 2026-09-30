"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/* Preferencia de movimiento: sistema (prefers-reduced-motion) o pausa */
/* manual desde el pie de página (data-motion="paused" en <html>).     */
/* ------------------------------------------------------------------ */

const MOTION_EVENT = "northa:motion";

function subscribeMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  window.addEventListener(MOTION_EVENT, callback);
  return () => {
    mq.removeEventListener("change", callback);
    window.removeEventListener(MOTION_EVENT, callback);
  };
}

function getMotionSnapshot() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "paused"
  );
}

/** `true` si hay que evitar animaciones (sistema o pausa manual). */
export function useCalmMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, getMotionSnapshot, () => false);
}

export function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  try {
    localStorage.setItem("northa-motion", paused ? "paused" : "on");
  } catch {
    /* almacenamiento no disponible: la preferencia vive solo en esta visita */
  }
  window.dispatchEvent(new Event(MOTION_EVENT));
}

/* ------------------------------------------------------------------ */
/* Media queries                                                       */
/* ------------------------------------------------------------------ */

export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

/* ------------------------------------------------------------------ */
/* Visibilidad en viewport                                             */
/* ------------------------------------------------------------------ */

export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  { rootMargin = "0px", once = false }: { rootMargin?: string; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

/** Datos ligeros: respeta "Ahorro de datos" y conexiones lentas. */
export function prefersLightData(): boolean {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ""));
}
