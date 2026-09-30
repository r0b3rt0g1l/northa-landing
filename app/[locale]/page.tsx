import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { faq } from "@/content/faq";
import { CerroBackdrop } from "@/components/cerro/CerroBackdrop";
import { Hero } from "@/components/hero/Hero";
import { Services } from "@/components/sections/Services";
import { Scope } from "@/components/sections/Scope";
import { WorkStrip } from "@/components/sections/WorkStrip";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/" });
}

/**
 * Inicio (30-sep-2026): el Cerro en vivo arriba y, al bajar, solo las luces de
 * la ciudad de fondo. Poco texto: servicios → cuéntanos qué necesitas →
 * portafolio corto → preguntas → contacto.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <CerroBackdrop />
      <Hero locale={locale} />
      <Services locale={locale} />
      <Scope locale={locale} />
      <WorkStrip locale={locale} />
      <Faq items={faq} locale={locale} eyebrow={dict.sections.faq.eyebrow} title={dict.sections.faq.title} />
      <Contact locale={locale} defer compact />
    </>
  );
}
