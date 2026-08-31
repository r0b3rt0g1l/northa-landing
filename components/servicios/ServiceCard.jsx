"use client";

import { useTilt } from "@/hooks/useTilt";

/**
 * Tarjeta de servicio con tilt 3D + glow magenta que sigue al cursor.
 * `icon` es un elemento ya renderizado (pasado desde el wrapper server).
 */
export function ServiceCard({ icon, title, description }) {
  const { ref, onPointerMove, onPointerLeave } = useTilt({ max: 7 });

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        transform:
          "perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
      }}
      className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-[transform,border-color,box-shadow] duration-200 will-change-transform hover:border-[var(--color-bright)]/40 hover:shadow-[0_18px_50px_-12px_rgba(255,46,126,0.35)] motion-reduce:transform-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(255,77,147,0.14), transparent 55%)",
        }}
      />
      <div className="relative">
        <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-line)] bg-white/5 text-[var(--color-bright)]">
          {icon}
        </span>
        <h3 className="text-[length:var(--text-h3)] font-semibold">{title}</h3>
        <p className="mt-3 text-[var(--color-muted)]">{description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;
