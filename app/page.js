import { Hero } from "@/components/hero/Hero";
import { TechMarquee } from "@/components/marquee/TechMarquee";
import { Servicios } from "@/components/servicios/Servicios";
import { ServiciosIA } from "@/components/ia/ServiciosIA";
import { Diferenciacion } from "@/components/diferenciacion/Diferenciacion";
import { Pilares } from "@/components/pilares/Pilares";
import { Showcase } from "@/components/showcase/Showcase";
import { Proceso } from "@/components/proceso/Proceso";
import { ContactoCTA } from "@/components/contacto/ContactoCTA";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

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
      <TechMarquee />
      <Servicios />
      <ServiciosIA />
      <Diferenciacion />
      <Pilares />
      <Showcase />
      <Proceso />
      <ContactoCTA />
    </>
  );
}
