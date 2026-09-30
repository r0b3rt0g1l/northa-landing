import { cn } from "@/lib/utils";
import { ENSO_CENTER, ENSO_DARK, ENSO_FULL, ENSO_LIGHT, ENSO_STROKE, ENSO_VIEWBOX } from "./enso-paths";

/**
 * Ensō de Amplía en HD (vector). Tres tonos del pincel suavizados dentro de la
 * silueta original, así se ve nítido a cualquier tamaño.
 *
 * `animate`: el pincel traza el círculo, la tinta respira y una luz lo recorre.
 * Todo en CSS/SVG (sin JavaScript) y quieto con "reducir movimiento".
 */
export function AmpliaEnso({
  size,
  id = "enso",
  animate = false,
  title,
  className,
}: {
  size?: number | string;
  /** Prefijo único para los ids internos (gradientes, máscaras). */
  id?: string;
  animate?: boolean;
  /** Texto accesible; sin él, el dibujo es decorativo. */
  title?: string;
  className?: string;
}) {
  const g = `${id}-g`;
  const soft = `${id}-soft`;
  const clip = `${id}-clip`;
  const reveal = `${id}-reveal`;
  const sheen = `${id}-sheen`;
  const glow = `${id}-glow`;
  const { x: cx, y: cy, r } = ENSO_CENTER;
  // A tamaños chicos (íconos) no vale la pena el desenfoque ni la animación.
  const small = typeof size === "number" && size <= 72;

  const body = (
    <g clipPath={`url(#${clip})`}>
      <rect width="1408" height="1344" fill={`url(#${g})`} />
      <path d={ENSO_LIGHT} fill="#8fded2" fillRule="evenodd" opacity="0.55" filter={small ? undefined : `url(#${soft})`} />
      <path d={ENSO_DARK} fill="#13504a" fillRule="evenodd" opacity="0.8" filter={small ? undefined : `url(#${soft})`} />
      {animate && !small && (
        <g className="enso-orbit" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx + r} cy={cy} r={300} fill={`url(#${sheen})`} />
        </g>
      )}
    </g>
  );

  return (
    <svg
      viewBox={ENSO_VIEWBOX}
      width={size}
      height={size}
      // El halo sale un poco del cuadro: sin esto se veía cortado en rectángulo.
      overflow="visible"
      className={cn("enso", animate && "enso-animate", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={g} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#5fc4b7" />
          <stop offset="0.5" stopColor="#3a9a91" />
          <stop offset="1" stopColor="#1f6d67" />
        </linearGradient>
        <radialGradient id={sheen}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glow}>
          <stop offset="0.6" stopColor="#3fb8ac" stopOpacity="0" />
          <stop offset="0.82" stopColor="#3fb8ac" stopOpacity="0.26" />
          <stop offset="1" stopColor="#3fb8ac" stopOpacity="0" />
        </radialGradient>
        {!small && (
          <filter id={soft} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        )}
        <clipPath id={clip}>
          <path d={ENSO_FULL} fillRule="evenodd" />
        </clipPath>
        {animate && !small && (
          <mask id={reveal} maskUnits="userSpaceOnUse" x="0" y="0" width="1408" height="1344">
            <path
              className="enso-reveal"
              d={ENSO_STROKE}
              pathLength={1}
              fill="none"
              stroke="#fff"
              strokeWidth="300"
              strokeLinecap="round"
            />
          </mask>
        )}
      </defs>
      {animate && !small && <circle className="enso-halo" cx={cx} cy={cy} r={r * 1.2} fill={`url(#${glow})`} />}
      {animate && !small ? <g mask={`url(#${reveal})`}>{body}</g> : body}
    </svg>
  );
}
