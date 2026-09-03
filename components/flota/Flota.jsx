import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { flota } from "@/lib/content/flota";
import { site } from "@/lib/site";

/**
 * Verde de Amplía Consultoría. Se hardcodea aquí hasta que exista la paleta
 * propia de /amplia como token global (var(--color-amplia) ya está en @theme).
 */
const AMPLIA_MARK_COLOR = "#3FB8AC";

function FlotaCard({ municipio, index }) {
  return (
    <Reveal delay={(index % 7) * 0.04} className="h-full">
      <a
        href={`https://${municipio.dominio}`}
        target="_blank"
        rel="noopener"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--color-bright)]/40 motion-reduce:hover:translate-y-0"
      >
        {/*
          Placa clara fija: los escudos están diseñados para papel, no para fondo oscuro.
          w-auto/h-auto evita el escalado hacia arriba (Soyopa 125×157, Aconchi 198×196
          dependen de esto para no verse lavados). No cambiar por w-full/h-full.
        */}
        <span className="flex h-28 items-center justify-center bg-[#F7F7F4] p-4">
          <img
            src={`/escudos/${municipio.slug}.png`}
            alt={`Escudo de ${municipio.nombre}`}
            loading="lazy"
            decoding="async"
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        </span>
        <span className="flex items-center justify-between gap-2 px-3.5 py-3 text-[0.9rem] font-medium">
          <span className="truncate">{municipio.nombre}</span>
          {municipio.amplia ? (
            <span
              className="inline-flex items-center leading-none"
              style={{ color: AMPLIA_MARK_COLOR }}
              title={`También trabaja con ${site.amplia.name}`}
            >
              <span aria-hidden="true">◍</span>
              <span className="sr-only"> — también trabaja con {site.amplia.name}</span>
            </span>
          ) : null}
          <span className="sr-only"> · {municipio.dominio} (se abre en una pestaña nueva)</span>
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
        title="Catorce ayuntamientos de Sonora, en producción."
      />
      <div className="mt-14 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
        {flota.map((municipio, i) => (
          <FlotaCard key={municipio.slug} municipio={municipio} index={i} />
        ))}
      </div>
      <p className="mt-6 text-sm text-[var(--color-muted)]">
        <span style={{ color: AMPLIA_MARK_COLOR }} aria-hidden="true">
          ◍
        </span>{" "}
        También trabajan con {site.amplia.name}.
      </p>
    </Section>
  );
}

export default Flota;
