"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Campo de estrellas + aurora rosa en Canvas.
 * - DPR limitado a 2; nº de estrellas escalado al área del viewport.
 * - Pausa el loop rAF cuando está fuera de pantalla o la pestaña está oculta.
 * - prefers-reduced-motion o equipos de pocos núcleos: un solo frame estático.
 */
export function Starfield({ className }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowPower =
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 2;
    const animate = !reduced && !lowPower;

    let width = 0;
    let height = 0;
    let stars = [];
    let rafId = null;
    let visible = true;

    const initStars = () => {
      const count = Math.min(150, Math.max(28, Math.round((width * height) / 9000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.55 + 0.2,
        vy: Math.random() * 0.14 + 0.02,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const drawAurora = () => {
      const max = Math.max(width, height);
      const g1 = ctx.createRadialGradient(
        width * 0.8, height * 0.16, 0,
        width * 0.8, height * 0.16, max * 0.62,
      );
      g1.addColorStop(0, "rgba(255,46,126,0.18)");
      g1.addColorStop(1, "rgba(255,46,126,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(
        width * 0.12, height * 0.9, 0,
        width * 0.12, height * 0.9, max * 0.55,
      );
      g2.addColorStop(0, "rgba(255,122,179,0.10)");
      g2.addColorStop(1, "rgba(255,122,179,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);
    };

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, width, height);
      drawAurora();
      for (const s of stars) {
        const alpha = animate
          ? s.a * (0.55 + 0.45 * Math.sin(t * 0.002 + s.tw))
          : s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,245,247,${alpha})`;
        ctx.fill();
      }
    };

    const tick = (t) => {
      for (const s of stars) {
        s.y -= s.vy;
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
      }
      draw(t);
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (animate && rafId == null) rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      draw();
    };

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

export default Starfield;
