import { Hero } from "@/components/hero/Hero";
import { Servicios } from "@/components/servicios/Servicios";
import { Seguridad } from "@/components/seguridad/Seguridad";
import { Portafolio } from "@/components/portafolio/Portafolio";
import { EscenaFinal } from "@/components/cierre/EscenaFinal";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

// Orden de scroll: hero → lo que construimos → portafolio → seguridad (la
// pieza de confianza que invita a escribir) → escena final. El contacto vive
// en el pie y en el asistente.
export default async function Home({ params }) {
  const { lang } = await params;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(lang)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(lang)) }}
      />
      <Hero locale={lang} />
      <Servicios locale={lang} />
      <Portafolio locale={lang} />
      <Seguridad locale={lang} />
      <EscenaFinal />
    </>
  );
}
