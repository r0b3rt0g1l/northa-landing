import { cn } from "@/lib/utils";

/**
 * Loader del Cerro de la Campana: el aro gira como brújula, las curvas de nivel
 * se dibujan, la estrella del norte late y el faro de la cima parpadea.
 *
 * - Solo CSS (sin JavaScript) y en bucle de 1.6 s.
 * - Con "reducir movimiento" o la pausa manual queda como un isotipo estático.
 * - `label` lo anuncia con role="status"; dentro de un botón que ya dice
 *   "Enviando…" úsalo con `decorative`.
 */
const HILL =
  "M2 50L7 49.3L11 47.6L14.5 44.2L19.5 37L23.5 31.2L27.5 28.1L32 27.2L36.5 28.1L40.5 31.2L44.5 37L49.5 44.2L53 47.6L57 49.3L62 50L60.5 56L3.5 56Z";
const STAR = "M32 4.56L34.54 11.86L40.16 14.4L34.54 16.94L32 24.24L29.46 16.94L23.84 14.4L29.46 11.86Z";
const STAR_NORTH = "M32 4.56L34.54 11.86L32 14.4L29.46 11.86Z";

export function CerroLoader({
  size = 48,
  label = "Cargando…",
  decorative = false,
  mono = false,
  className,
}: {
  size?: number;
  label?: string;
  decorative?: boolean;
  /** Todo en el color del texto (para botones con fondo de acento). */
  mono?: boolean;
  className?: string;
}) {
  const accent = mono ? "currentColor" : "var(--accent)";
  const svg = (
    <svg width={size} height={size} viewBox="0 0 64 64" className="cerro-loader" aria-hidden focusable="false">
      <circle cx="32" cy="32" r="30.5" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
      <circle
        className="cl-arc"
        cx="32"
        cy="32"
        r="30.5"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.22 0.78"
      />
      <path d={HILL} fill="currentColor" fillOpacity={mono ? 0.35 : 0.85} />
      <path className="cl-contour" d="M20.2 36Q32 39.2 43.8 36" pathLength={1} fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path
        className="cl-contour cl-contour-2"
        d="M15.3 43Q32 47 48.7 43"
        pathLength={1}
        fill="none"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle className="cl-light" cx="32" cy="26.3" r="1.5" fill={accent} />
      <g className="cl-star">
        <path d={STAR} fill="currentColor" />
        <path d={STAR_NORTH} fill={accent} />
      </g>
    </svg>
  );

  const tone = mono ? "" : "text-ink";
  if (decorative) return <span className={cn("inline-grid place-items-center", tone, className)}>{svg}</span>;
  return (
    <span role="status" className={cn("inline-grid place-items-center", tone, className)}>
      {svg}
      <span className="sr-only">{label}</span>
    </span>
  );
}
