"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { prefersLightData, useCalmMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Mode = "auto" | "paused" | "playing";

/**
 * Video de fondo del hero.
 *  - Carga diferida: no compite con el póster (LCP) ni con la hidratación.
 *  - Vertical/horizontal con <source media>: el celular baja el render 720×1280.
 *  - WebM (VP9) primero y MP4 (H.264) de respaldo; muted + playsInline para iPhone.
 *  - Se pausa fuera de pantalla y con la pestaña oculta.
 *  - Con "reducir movimiento", "Pausar animaciones" o Ahorro de datos no se
 *    descarga; el botón permite reproducirlo a voluntad (WCAG 2.2.2).
 */
export function HeroVideo({
  label,
  pauseLabel,
  playLabel,
  caption,
}: {
  label: string;
  pauseLabel: string;
  playLabel: string;
  caption: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const calm = useCalmMotion();
  const [mode, setMode] = useState<Mode>("auto");
  // "ready": la página ya cargó, hay un momento ocioso y no hay Ahorro de datos.
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Tras el primer cuadro, el video queda visible aunque se pause.
  const [shown, setShown] = useState(false);

  const wantPlay = mode === "playing" || (mode === "auto" && !calm);

  // Espera al evento load y a un momento ocioso antes de pedir el video.
  useEffect(() => {
    const done = () => setReady(!prefersLightData());
    const schedule = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(done, { timeout: 2500 });
      else window.setTimeout(done, 1200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => window.removeEventListener("load", schedule);
  }, []);

  // Una vez cargado, se queda cargado (estado ajustado durante el render, sin efecto).
  if (!loaded && (mode === "playing" || (ready && wantPlay))) setLoaded(true);

  // Visibilidad en pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reproduce o pausa.
  useEffect(() => {
    const video = ref.current;
    if (!video || !loaded) return;
    const sync = () => {
      if (wantPlay && visible && !document.hidden) video.play().catch(() => setPlaying(false));
      else video.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [loaded, wantPlay, visible]);

  return (
    <>
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 -z-20 size-full object-cover transition-opacity duration-[1400ms] ease-out",
          shown ? "opacity-100" : "opacity-0",
        )}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        disablePictureInPicture
        disableRemotePlayback
        onPlaying={() => {
          setPlaying(true);
          setShown(true);
        }}
        onPause={() => setPlaying(false)}
      >
        {loaded && (
          <>
            <source src="/video/cerro-720x1280.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
            <source src="/video/cerro-720x1280.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
            <source src="/video/cerro-1920x1080.webm" type="video/webm" />
            <source src="/video/cerro-1920x1080.mp4" type="video/mp4" />
          </>
        )}
      </video>

      <div className="absolute left-5 top-24 z-10 flex items-center gap-3 md:bottom-7 md:left-8 md:top-auto">
        <button
          type="button"
          onClick={() => setMode(playing ? "paused" : "playing")}
          aria-label={playing ? pauseLabel : playLabel}
          title={playing ? pauseLabel : playLabel}
          className="grid size-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition-colors hover:border-white/60"
        >
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        </button>
        <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/55 lg:inline">
          {caption}
        </span>
      </div>
    </>
  );
}
