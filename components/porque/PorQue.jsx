import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { porque } from "@/lib/content/porque";
import { flota } from "@/lib/content/flota";

export function PorQue() {
  return (
    <Section id="porque" labelledBy="porque-title">
      <SectionHeader
        eyebrow="Por qué Northa"
        titleId="porque-title"
        title="Rápido, confiable y moderno."
        align="center"
      />
      <ul className="mt-14 grid gap-10 sm:grid-cols-3">
        {porque.map((r, i) => (
          <Reveal as="li" key={r.title} delay={i * 0.08} className="flex flex-col items-center text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full gradient-brand text-white shadow-[0_10px_30px_-10px_rgba(255,46,126,0.7)]">
              <r.Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{r.title}</h3>
            <p className="mt-2 max-w-[28ch] text-sm text-[var(--color-muted)]">{r.description}</p>
          </Reveal>
        ))}
      </ul>

      {/* Prueba: los catorce escudos en una franja, sin más texto */}
      <Reveal delay={0.1} className="mt-20 flex flex-col items-center gap-6">
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.28em] text-[var(--color-muted)]">
          Catorce ayuntamientos de Sonora confían en Northa
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {flota.map((m) => (
            <li key={m.slug}>
              <a
                href={`https://${m.dominio}`}
                target="_blank"
                rel="noopener"
                title={m.nombre}
                className="grid h-14 w-14 place-items-center rounded-xl bg-[#F7F7F4] p-2 opacity-80 transition-[opacity,transform] duration-300 hover:-translate-y-0.5 hover:opacity-100 motion-reduce:hover:translate-y-0"
              >
                <img
                  src={`/escudos/${m.slug}.png`}
                  alt={`Escudo de ${m.nombre}`}
                  loading="lazy"
                  decoding="async"
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export default PorQue;
