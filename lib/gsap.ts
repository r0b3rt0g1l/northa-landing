"use client";

import type { gsap as GsapCore } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export interface GsapKit {
  gsap: typeof GsapCore;
  ScrollTrigger: typeof ScrollTriggerType;
}

let kit: Promise<GsapKit> | null = null;

/**
 * GSAP + ScrollTrigger bajo demanda.
 *
 * No viajan en el JavaScript inicial: se descargan cuando una sección que los
 * usa se acerca a la pantalla. Así no compiten con la carga de la página, y el
 * bucle de requestAnimationFrame que ScrollTrigger arranca al registrarse no
 * corre mientras nadie ha llegado a esas secciones.
 *
 * Las secciones de abajo usan `content-visibility: auto`, que cambia la altura
 * de la página cuando se pintan por primera vez sin disparar `resize`. Un
 * ResizeObserver sobre <body> recalcula las posiciones de ScrollTrigger cuando
 * eso pasa (con un pequeño retraso para agrupar cambios).
 */
export function loadGsap(): Promise<GsapKit> {
  kit ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([core, st]) => {
    const gsap = core.gsap;
    const { ScrollTrigger } = st;
    gsap.registerPlugin(ScrollTrigger);
    let timer: number | undefined;
    let lastHeight = document.body.offsetHeight;
    new ResizeObserver(() => {
      const height = document.body.offsetHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    }).observe(document.body);
    return { gsap, ScrollTrigger };
  });
  return kit;
}
