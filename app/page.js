import { Hero } from "@/components/hero/Hero";
import { ServiciosGrid } from "@/components/servicios/ServiciosGrid";
import { PorQue } from "@/components/porque/PorQue";
import { Planes } from "@/components/planes/Planes";
import { ContactoCTA } from "@/components/contacto/ContactoCTA";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

/**
 * Home: hero (video) → servicios → por qué Northa → planes → contacto.
 * Se entiende en tres segundos: un titular y un botón por bloque.
 * Las secciones largas (Servicios, ServiciosIA, Diferenciacion, Pilares,
 * Proceso, Flota, TechMarquee) siguen en components/ por si vuelven a hacer falta.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <Hero />
      <ServiciosGrid />
      <PorQue />
      <Planes />
      <ContactoCTA />
    </>
  );
}
