"use client";

import { useEffect } from "react";

/**
 * Favicon animado en todos los navegadores. El SVG de app/icon.svg ya anima el
 * faro en Firefox; Chrome y Safari muestran favicons estáticos, así que cuando
 * la pestaña queda en segundo plano dibujamos el isotipo en un canvas y
 * encendemos/apagamos el faro de la cima (1 vez por segundo, lo máximo que el
 * navegador permite en pestañas ocultas). Al volver, se restaura el original.
 */
export function FaviconAnimator() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]') ??
      document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) return;
    const original = link.href;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/brand/northa-mark.svg";
    let timer: ReturnType<typeof setInterval> | null = null;
    let on = true;

    const draw = () => {
      ctx.clearRect(0, 0, 64, 64);
      ctx.drawImage(img, 0, 0, 64, 64);
      // Faro de la cima (mismo punto que en el SVG: 32, 26.3)
      ctx.beginPath();
      ctx.arc(32, 26.3, on ? 2.6 : 1.4, 0, Math.PI * 2);
      ctx.fillStyle = on ? "#ffae82" : "#5a3a2c";
      ctx.shadowColor = "#ffae82";
      ctx.shadowBlur = on ? 8 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;
      link.href = canvas.toDataURL("image/png");
      on = !on;
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (!img.complete) return;
        draw();
        timer = setInterval(draw, 1000);
      } else {
        if (timer) clearInterval(timer);
        timer = null;
        link.href = original;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timer) clearInterval(timer);
      link.href = original;
    };
  }, []);
  return null;
}
