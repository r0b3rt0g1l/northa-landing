import { Cabecera } from "@/components/home/Cabecera";
import { Hero } from "@/components/hero/Hero";
import { Espina } from "@/components/home/Espina";
import { Prueba } from "@/components/home/Prueba";
import { EscudosCta } from "@/components/home/EscudosCta";
import { Pie } from "@/components/home/Pie";
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
      <Cabecera />
      <Hero />
      <Espina />
      <Prueba />
      <EscudosCta />
      <Pie />
    </>
  );
}
