import { Check } from "lucide-react";

/**
 * Columna de pilar de calidad. La etiqueta (badge) es un hecho defendible,
 * no una métrica inventada. `icon` se pasa ya renderizado desde el wrapper.
 */
export function PilarCard({ icon, title, badge, points }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-line)] bg-white/5 text-[var(--color-bright)]">
          {icon}
        </span>
        <span className="rounded-full border border-[var(--color-bright)]/30 bg-[var(--color-bright)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-bright)]">
          {badge}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[var(--color-muted)]">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-bright)]"
              aria-hidden="true"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PilarCard;
