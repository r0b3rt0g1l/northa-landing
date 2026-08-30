import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { flota } from "@/lib/content/flota";

/**
 * Verde de Amplía Consultoría (--a1 en la maqueta de referencia). Se hardcodea
 * aquí porque la paleta propia de /amplia todavía no existe como token global
 * (llega en la fase de la página de Amplía); cuando exista, reemplazar por
 * var(--color-amplia) o equivalente.
 */
const AMPLIA_MARK_COLOR = "#3FB8AC";

function FlotaCard({ municipio, index }) {
  return (
    <Reveal delay={(index % 7) * 0.05} className="h-full">
      <a
        href={`https://${municipio.dominio}`}
        target="_blank"
        rel="noopener"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--color-bright)]/40 hover:bg-[var(--color-surface-2)]"
      >
        {/* Placa clara fija: los escudos están diseñados para papel, no para fondo oscuro */}
        <span className="flex h-32 items-center justify-center bg-[#F7F7F4] p-4">
          <img
            src={`/escudos/${municipio.slug}.png`}
            alt={`Escudo de ${municipio.nombre}`}
            loading="lazy"
            decoding="async"
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        </span>
        <span className="flex items-center gap-1.5 px-3.5 pt-3 text-[0.95rem] font-semibold">
          {municipio.nombre}
          {municipio.amplia ? (
            <span
              className="inline-flex items-center leading-none"
              style={{ color: AMPLIA_MARK_COLOR }}
              title="También trabaja con Amplía Consultoría"
            >
              <span aria-hidden="true">◍</span>
              <span className="sr-only"> — también trabaja con Amplía Consultoría</span>
            </span>
          ) : null}
        </span>
        <span className="break-all px-3.5 pb-3.5 pt-0.5 font-mono text-[0.7rem] text-[var(--color-muted)]">
          {municipio.dominio}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </span>
      </a>
    </Reveal>
  );
}

export function Flota() {
  return (
    <Section id="flota" labelledBy="flota-title">
      <SectionHeader
        eyebrow="La flota"
        titleId="flota-title"
        title="Catorce ayuntamientos, catorce portales"
        description={
          <>
            Cada uno con su escudo, su dominio propio y su panel de administración. Da
            clic en cualquiera para abrirlo en vivo. Los marcados con{" "}
            <span style={{ color: AMPLIA_MARK_COLOR }} aria-hidden="true">
              ◍
            </span>{" "}
            también trabajan con Amplía Consultoría.
          </>
        }
      />
      <div className="mt-14 grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(168px,1fr))]">
        {flota.map((municipio, i) => (
          <FlotaCard key={municipio.slug} municipio={municipio} index={i} />
        ))}
      </div>
    </Section>
  );
}

export default Flota;
