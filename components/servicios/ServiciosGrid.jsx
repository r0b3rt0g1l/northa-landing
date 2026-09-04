import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { serviciosGrid } from "@/lib/content/serviciosGrid";

export function ServiciosGrid() {
  return (
    <Section id="servicios" labelledBy="servicios-title" className="section-glow">
      <SectionHeader
        eyebrow="Servicios"
        titleId="servicios-title"
        title="Todo lo que tu organización necesita."
        align="center"
      />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {serviciosGrid.map((s, i) => (
          <Reveal as="li" key={s.title} delay={(i % 4) * 0.06} className="h-full">
            <GlassCard className="h-full p-6">
              <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-line)] bg-white/[0.04] text-[var(--color-bright)]">
                <s.Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{s.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export default ServiciosGrid;
