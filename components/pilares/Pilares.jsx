import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { PilarCard } from "./PilarCard";
import { pilares } from "@/lib/content/pilares";

export function Pilares() {
  return (
    <Section id="calidad" labelledBy="calidad-title">
      <SectionHeader
        eyebrow="Calidad"
        titleId="calidad-title"
        title="Practicamos lo que vendemos"
        description="Cuatro pilares que aplicamos en cada portal —y en esta misma página."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pilares.map((p, i) => (
          <Reveal key={p.title} delay={(i % 4) * 0.06} className="h-full">
            <PilarCard
              icon={<p.Icon className="h-5 w-5" aria-hidden="true" />}
              title={p.title}
              badge={p.badge}
              points={p.points}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default Pilares;
