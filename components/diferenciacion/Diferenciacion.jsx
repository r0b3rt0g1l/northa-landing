import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Comparator } from "./Comparator";

export function Diferenciacion() {
  return (
    <Section id="diferenciacion" labelledBy="diferenciacion-title">
      <SectionHeader
        eyebrow="Por qué Northa"
        titleId="diferenciacion-title"
        title="La diferencia entre un portal heredado y un portal Northa"
        description="Muchos portales municipales siguen corriendo sobre sistemas genéricos de hace más de una década. Así se siente el cambio."
      />
      <Comparator />
    </Section>
  );
}

export default Diferenciacion;
