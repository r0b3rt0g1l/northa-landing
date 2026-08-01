import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { AICard } from "./AICard";
import { serviciosIA } from "@/lib/content/serviciosIA";

export function ServiciosIA() {
  return (
    <Section
      id="ia"
      labelledBy="ia-title"
      className="relative overflow-hidden"
    >
      {/* Glow superior que distingue el bloque de IA */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,46,126,0.10),transparent_70%)]"
      />
      <SectionHeader
        eyebrow="Inteligencia Artificial"
        titleId="ia-title"
        title="IA que trabaja para tu municipio y tu gente"
        description="Servicios de inteligencia artificial que construimos para ti, pensados por lo que logran: menos carga para tu equipo y mejor atención para el ciudadano."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviciosIA.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.06} className="h-full">
            <AICard
              icon={<s.Icon className="h-5 w-5" aria-hidden="true" />}
              title={s.title}
              description={s.description}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default ServiciosIA;
