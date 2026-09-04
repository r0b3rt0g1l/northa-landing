import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { planes } from "@/lib/content/planes";

export function Planes() {
  return (
    <Section id="planes" labelledBy="planes-title" className="section-glow">
      <SectionHeader
        eyebrow="Planes mensuales"
        titleId="planes-title"
        title="Un plan para cada etapa."
        align="center"
      />
      <ul className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {planes.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 0.08} className="h-full">
            <GlassCard featured={p.featured} className="flex h-full flex-col p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-[-0.02em]">{p.name}</h3>
                {p.featured ? (
                  <span className="rounded-full gradient-brand px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{p.tagline}</p>
              <ul className="mt-7 flex flex-col gap-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-bright)]" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-2">
                <Button
                  href={`#contacto`}
                  variant={p.featured ? "primary" : "secondary"}
                  className="w-full"
                >
                  {p.cta}
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export default Planes;
