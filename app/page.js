import { Hero } from "@/components/hero/Hero";
import { Flota } from "@/components/flota/Flota";
import { QueHacemos } from "@/components/servicios/QueHacemos";
import { Proceso } from "@/components/proceso/Proceso";
import { ContactoCTA } from "@/components/contacto/ContactoCTA";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

/**
 * Home minimalista: hero con video → la flota → qué hacemos → cómo trabajamos
 * → contacto. Las secciones largas (Servicios, ServiciosIA, Diferenciacion,
 * Pilares, TechMarquee) siguen en components/ por si vuelven a hacer falta.
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
      <Flota />
      <QueHacemos />
      <Proceso />
      <ContactoCTA />
    </>
  );
}
