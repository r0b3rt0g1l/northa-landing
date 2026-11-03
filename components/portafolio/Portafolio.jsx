import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Municipios } from "./Municipios";
import { getProyectoDestacado } from "@/lib/content/proyectos";
import { getUi } from "@/lib/i18n/ui";

/**
 * ¿Qué trabajo real han hecho? Todos los municipios con portal publicado, en
 * un solo contenedor compacto con la página de inicio real de cada uno y su
 * enlace. Añadir un municipio = una entrada en lib/content/proyectos.js y su
 * captura (scripts/capturar-portales.mjs).
 */
export function Portafolio({ locale }) {
  const proyecto = getProyectoDestacado(locale);
  const ui = getUi(locale).portafolio;
  if (!proyecto) return null;
  const { enlaces = [] } = proyecto;

  return (
    <Section id="portafolio" labelledBy="portafolio-title">
      <SectionHeader
        eyebrow={ui.eyebrow}
        title={ui.titulo}
        titleId="portafolio-title"
        description={ui.descripcion}
      />
      <Reveal className="mt-12 sm:mt-16">
        <Municipios enlaces={enlaces} locale={locale} />
      </Reveal>
    </Section>
  );
}

export default Portafolio;
