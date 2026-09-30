import { cn } from "@/lib/utils";

/**
 * Isotipo de Northa: el Cerro de la Campana (low-poly, con curvas de nivel)
 * y la estrella del norte encima. Fusión aprobada de la estrella de 4 puntas
 * original con el cerro que da identidad a Hermosillo.
 *
 * La silueta parte del perfil poniente del modelo procedural
 * (lib/three/terrain.ts, simplificado con Ramer–Douglas–Peucker) y se estilizó
 * hacia la campana: base abierta y cima redonda. Logo, video y 3D son el mismo cerro.
 *
 * `animate` dibuja el aro y las curvas, levanta el cerro y hace subir la
 * estrella (solo CSS: funciona sin JavaScript y respeta movimiento reducido).
 */

const HILL = "M2 50L7 49.3L11 47.6L14.5 44.2L19.5 37L23.5 31.2L27.5 28.1L32 27.2L36.5 28.1L40.5 31.2L44.5 37L49.5 44.2L53 47.6L57 49.3L62 50L64 64L0 64Z";
const FACET_LIGHT = "M2 50L7 49.3L11 47.6L14.5 44.2L19.5 37L23.5 31.2L27.5 28.1L32 27.2L27 64L0 64Z";
const FACET_MID = "M32 27.2L27 64L38 64Z";
const FACET_DARK = "M32 27.2L36.5 28.1L40.5 31.2L44.5 37L49.5 44.2L53 47.6L57 49.3L62 50L64 64L38 64Z";
const STAR = "M32 4.56L34.54 11.86L40.16 14.4L34.54 16.94L32 24.24L29.46 16.94L23.84 14.4L29.46 11.86Z";
const STAR_NORTH = "M32 4.56L34.54 11.86L32 14.4L29.46 11.86Z";

export interface CerroMarkProps {
  size?: number;
  /** Prefijo único para los ids internos del SVG (gradientes, recortes). */
  id?: string;
  animate?: boolean;
  /** Texto accesible. Si se omite, el SVG es decorativo. */
  title?: string;
  className?: string;
}

export function CerroMark({ size = 36, id = "cm", animate = false, title, className }: CerroMarkProps) {
  const sky = `${id}-sky`;
  const glow = `${id}-glow`;
  const north = `${id}-north`;
  const clip = `${id}-clip`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("cerro-mark shrink-0", className)}
      data-animate={animate ? "true" : undefined}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3d72" />
          <stop offset="0.62" stopColor="#15204a" />
          <stop offset="1" stopColor="#0a1124" />
        </linearGradient>
        <radialGradient id={glow} cx="32" cy="15" r="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF9F6E" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FF9F6E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={north} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD2B8" />
          <stop offset="1" stopColor="#FF9F6E" />
        </linearGradient>
        <clipPath id={clip}>
          <circle cx="32" cy="32" r="30.5" />
        </clipPath>
      </defs>

      <circle cx="32" cy="32" r="30.5" fill={`url(#${sky})`} />
      <circle cx="32" cy="15" r="15" fill={`url(#${glow})`} className="cm-glow" />

      <g clipPath={`url(#${clip})`}>
        <g className="cm-hill">
          <path d={FACET_LIGHT} fill="#ECECF1" />
          <path d={FACET_MID} fill="#CFCFD9" />
          <path d={FACET_DARK} fill="#A9AAB7" />
          <path d={HILL} fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.6" />
        </g>
        <path
          className="cm-contour"
          pathLength={1}
          d="M20.2 36Q32 39.2 43.8 36"
          fill="none"
          stroke="#FF9F6E"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          className="cm-contour"
          pathLength={1}
          d="M15.3 43Q32 47 48.7 43"
          fill="none"
          stroke="#FF9F6E"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>

      <circle className="cm-light" cx="32" cy="26.3" r="1.25" fill="#FF9F6E" />

      <g className="cm-star">
        <path d={STAR} fill="#F5F5F7" />
        <path d={STAR_NORTH} fill={`url(#${north})`} />
      </g>

      <circle
        className="cm-ring"
        pathLength={1}
        cx="32"
        cy="32"
        r="30.5"
        fill="none"
        stroke="#2f3f6b"
        strokeWidth="1"
        transform="rotate(-90 32 32)"
      />
    </svg>
  );
}

/** Logotipo completo: isotipo + "Northa / DIGITAL". */
export function NorthaLogo({
  id = "logo",
  animate = false,
  size = 36,
  className,
  showWordmark = true,
  onDark = false,
}: {
  id?: string;
  animate?: boolean;
  size?: number;
  className?: string;
  showWordmark?: boolean;
  /** Sobre el video del hero el texto va en blanco sin importar el tema. */
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CerroMark id={id} size={size} animate={animate} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.15rem] font-bold tracking-[-0.02em] transition-colors",
              onDark ? "text-white" : "text-ink",
            )}
          >
            Northa
          </span>{" "}
          {/* El espacio de arriba hace que el texto visible sea "Northa DIGITAL" (WCAG 2.5.3). */}
          <span
            className={cn(
              "mt-[3px] font-mono text-[0.56rem] tracking-[0.42em] transition-colors",
              onDark ? "text-northa-2" : "text-accent-ink",
            )}
          >
            DIGITAL
          </span>
        </span>
      )}
    </span>
  );
}
