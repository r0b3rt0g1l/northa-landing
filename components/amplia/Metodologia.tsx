import type { Locale } from "@/lib/i18n/config";
import { metodologia } from "@/content/amplia";

/**
 * Lámina 7 de Amplía: tres círculos que se intersectan (Planeación,
 * Implementación, Seguimiento) y Transparencia como cuarto círculo que los
 * atraviesa. Se conserva así: la transparencia es eje transversal, no una etapa más.
 */
export function MetodologiaDiagram({ locale }: { locale: Locale }) {
  const [plan, impl, seg, transp] = metodologia;
  const circles = [
    { cx: 200, cy: 128, label: plan.title[locale], lx: 200, ly: 92, delay: "0ms", fill: "#3fb8ac" },
    { cx: 132, cy: 206, label: impl.title[locale], lx: 108, ly: 210, delay: "120ms", fill: "#5fccc0" },
    { cx: 268, cy: 206, label: seg.title[locale], lx: 292, ly: 210, delay: "240ms", fill: "#2f9fb3" },
    { cx: 200, cy: 284, label: transp.title[locale], lx: 200, ly: 330, delay: "360ms", fill: "#1f6f68" },
  ];
  return (
    <svg
      viewBox="0 0 400 420"
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label={`${plan.title[locale]}, ${impl.title[locale]}, ${seg.title[locale]} · ${transp.title[locale]} (${transp.tag[locale]})`}
    >
      {circles.map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={98}
          fill={c.fill}
          fillOpacity={i === 3 ? 0.28 : 0.34}
          stroke="#7fd8ce"
          strokeOpacity={0.35}
          className="venn-circle"
          style={{ animationDelay: c.delay, transformOrigin: `${c.cx}px ${c.cy}px` }}
        />
      ))}
      {circles.map((c, i) => (
        <text
          key={`t${i}`}
          x={c.lx}
          y={c.ly}
          textAnchor="middle"
          className="fill-[var(--ink)] font-display"
          fontSize={i === 3 ? 17 : 15}
          fontWeight={700}
          letterSpacing="0.02em"
        >
          {c.label.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}
