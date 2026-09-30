import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { faq } from "@/content/faq";
import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Services } from "@/components/sections/Services";
import { Scope } from "@/components/sections/Scope";
import { Work } from "@/components/sections/Work";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { Principles } from "@/components/sections/Principles";
import { Hermosillo } from "@/components/sections/Hermosillo";
import { GovBand } from "@/components/sections/GovBand";
import { Plans } from "@/components/sections/Plans";
import { Faq } from "@/components/sections/Faq";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { Contact } from "@/components/sections/Contact";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/" });
}

/**
 * Home — orden pensado para conversión:
 * impacto (hero) → prueba (cifras) → qué hacemos (servicios, por búsqueda) →
 * interacción (arma tu proyecto) → evidencia (trabajo) → cómo (proceso, reglas) →
 * identidad (Hermosillo 3D) → gobierno (apartado) → planes → dudas → blog → contacto.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <Hero locale={locale} />
      <TrustStrip locale={locale} />
      <Services locale={locale} />
      <Scope locale={locale} />
      <Work locale={locale} />
      <ProcessSection locale={locale} />
      <Principles locale={locale} />
      <Hermosillo locale={locale} />
      <GovBand locale={locale} />
      <Plans locale={locale} />
      <Faq items={faq} locale={locale} eyebrow={dict.sections.faq.eyebrow} title={dict.sections.faq.title} />
      <BlogTeaser locale={locale} />
      <Contact locale={locale} defer />
    </>
  );
}
