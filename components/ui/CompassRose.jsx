"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// 8 rumbos: N, S, E, O y las 4 diagonales.
const NEEDLE_TICKS = [
  [200, 24, 200, 46],
  [200, 354, 200, 376],
  [24, 200, 46, 200],
  [354, 200, 376, 200],
  [76, 76, 92, 92],
  [308, 308, 324, 324],
  [324, 76, 308, 92],
  [92, 308, 76, 324],
];

/**
 * Rosa de los vientos completa: 8 rumbos, dos anillos concéntricos, punta
 * norte en el gradiente rosa de marca. Pieza gráfica decorativa del hero —
 * no es un ícono de marca; no reemplaza a StarIcon, app/icon.svg ni
 * public/northa-icon.svg (el favicon y el lockup son otra decisión).
 * Solo la aguja central gira, muy lento; el marco y la "N" quedan fijos.
 * Sin animación si el usuario prefiere movimiento reducido.
 */
export function CompassRose({ className }) {
  const reduced = useReducedMotion();

  const needle = (
    <>
      <path
        d="M200 62 L216 184 L338 200 L216 216 L200 338 L184 216 L62 200 L184 184 Z"
        fill="#F5F5F7"
      />
      <path d="M200 62 L216 184 L200 200 L184 184 Z" fill="url(#compassRoseGrad)" />
      <path d="M200 338 L184 216 L200 200 L216 216 Z" fill="#86868B" opacity="0.5" />
      <path d="M138 138 L200 200 L138 262 L162 200 Z" fill="#F5F5F7" opacity="0.22" />
      <path d="M262 138 L200 200 L262 262 L238 200 Z" fill="#F5F5F7" opacity="0.22" />
      <circle cx="200" cy="200" r="9" fill="#0B0B0C" stroke="#FF2E7E" strokeWidth="2.5" />
    </>
  );

  return (
    <div aria-hidden="true" className={className}>
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <linearGradient id="compassRoseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF7AB3" />
            <stop offset="1" stopColor="#FF2E7E" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="176" fill="none" stroke="#86868B" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="142" fill="none" stroke="#86868B" strokeOpacity="0.22" strokeWidth="1.5" />
        <g stroke="#86868B" strokeOpacity="0.45" strokeWidth="1.2">
          {NEEDLE_TICKS.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        {reduced ? (
          <g>{needle}</g>
        ) : (
          <motion.g
            style={{ transformOrigin: "200px 200px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
          >
            {needle}
          </motion.g>
        )}
        <text
          x="200"
          y="22"
          textAnchor="middle"
          fill="#FF7AB3"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontWeight="700"
          fontSize="16"
          letterSpacing="2"
        >
          N
        </text>
      </svg>
    </div>
  );
}

export default CompassRose;
