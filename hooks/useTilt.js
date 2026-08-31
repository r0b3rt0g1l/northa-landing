"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Tilt 3D por puntero para tarjetas. Escribe variables CSS directamente en el
 * elemento (sin re-render) para máximo rendimiento:
 *   --rx / --ry  → rotación; --gx / --gy → posición del glow radial.
 * Solo punteros finos (ignora touch) y respeta prefers-reduced-motion.
 */
export function useTilt({ max = 7 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e) => {
      if (reduced || e.pointerType === "touch") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(0.5 - py) * 2 * max}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    },
    [reduced, max],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}

export default useTilt;
