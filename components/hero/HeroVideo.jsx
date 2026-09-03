"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Video de fondo del hero.
 *
 * - Arranca invisible (opacity 0) sobre la imagen fija nocturna y aparece con
 *   un fundido cuando el navegador confirma que ya está reproduciendo. Si el
 *   archivo no existe todavía (o el navegador bloquea el autoplay), la imagen
 *   fija se queda tal cual: nunca hay un hueco negro.
 * - No hace loop: el clip va de día a noche y se queda en el último cuadro,
 *   que coincide con la imagen fija.
 * - Con prefers-reduced-motion no se renderiza el <video>.
 */
export function HeroVideo({ sources = [] }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    // Safari iOS a veces necesita el play() explícito aunque tenga autoplay.
    const p = v.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [reduced]);

  if (reduced || sources.length === 0) return null;

  return (
    <video
      ref={ref}
      className={cn(
        "hero-media transition-opacity duration-[1400ms] ease-out",
        playing ? "opacity-100" : "opacity-0",
      )}
      autoPlay
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}

export default HeroVideo;
