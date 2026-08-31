import { StarIcon } from "@/components/ui/StarIcon";

/**
 * Cabecera del despacho conjunto: aro de Amplía + línea-degradado + estrella
 * de Northa, a la izquierda; ubicación a la derecha. Estática — sin sticky,
 * sin scroll-spy, sin menú móvil: la página ya no tiene más anclas que saltar.
 * Estructura y valores exactos de la dirección C (un-solo-flujo).
 */
export function Cabecera() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-[60px] sm:py-[24px]">
      <div className="flex flex-wrap items-center gap-[14px]">
        <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="37" fill="none" stroke="var(--color-amplia)" strokeWidth="9" />
        </svg>
        <span className="font-mono text-[11px] tracking-[0.16em] text-[#7A7A88]">
          AMPLÍA
        </span>
        <span
          aria-hidden="true"
          className="h-px w-[26px] bg-[linear-gradient(90deg,var(--color-amplia),var(--color-primary))]"
        />
        <span className="font-mono text-[11px] tracking-[0.16em] text-[#7A7A88]">
          NORTHA
        </span>
        <StarIcon className="h-6 w-6 text-[var(--color-text)]" />
      </div>
      <span className="font-mono text-[11px] tracking-[0.14em] text-[#5C5C68]">
        SONORA · MX
      </span>
    </header>
  );
}

export default Cabecera;
