import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "./ServiceCard";
import { servicios } from "@/lib/content/servicios";

export function Servicios() {
  return (
    <Section id="servicios" labelledBy="servicios-title">
      <SectionHeader
        eyebrow="Servicios"
        titleId="servicios-title"
        title="Todo lo que tu municipio necesita, en un solo portal"
        description="Una plataforma institucional completa, lista para servir al ciudadano y fácil de mantener por tu propio equipo."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.06} className="h-full">
            <ServiceCard
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

export default Servicios;
