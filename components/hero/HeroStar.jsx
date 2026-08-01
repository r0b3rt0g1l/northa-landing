"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SPRING = { stiffness: 70, damping: 18, mass: 0.6 };

/**
 * Estrella polar de marca a gran escala, reactiva al cursor (rotación 3D +
 * desplazamiento sutil) con glow rosa. Decorativa (aria-hidden).
 * prefers-reduced-motion → estrella estática sin listeners.
 */
export function HeroStar({ className }) {
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-22, 22]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [16, -16]), SPRING);
  const x = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), SPRING);
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), SPRING);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  const svg = (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full [filter:drop-shadow(0_0_55px_rgba(255,46,126,0.55))]"
    >
      <defs>
        <linearGradient id="heroStarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF7AB3" />
          <stop offset="1" stopColor="#FF2E7E" />
        </linearGradient>
      </defs>
      <path
        d="M100 18 L121.2 78.8 L168 100 L121.2 121.2 L100 182 L78.8 121.2 L32 100 L78.8 78.8 Z"
        fill="#F5F5F7"
      />
      <path
        d="M100 18 L121.2 78.8 L100 100 L78.8 78.8 Z"
        fill="url(#heroStarGrad)"
      />
    </svg>
  );

  if (reduced) {
    return (
      <div className={className} aria-hidden="true">
        {svg}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      aria-hidden="true"
      style={{ rotateX, rotateY, x, y, transformPerspective: 800 }}
    >
      {svg}
    </motion.div>
  );
}

export default HeroStar;
