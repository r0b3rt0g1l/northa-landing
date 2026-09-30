import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { absoluteUrl } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/jsonld";
import { faq } from "@/content/faq";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/contacto", title: dict.nav.contact, description: dict.sections.contact.lead });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(locale),
          breadcrumbJsonLd([
            { name: dict.breadcrumbs.home, url: absoluteUrl(site.url, locale, "/") },
            { name: dict.nav.contact, url: absoluteUrl(site.url, locale, "/contacto") },
          ]),
        ]}
      />
      <div className="pt-16">
        <Contact locale={locale} headingLevel="h1" />
      </div>
      <Faq items={faq} locale={locale} eyebrow={dict.sections.faq.eyebrow} title={dict.sections.faq.title} />
    </>
  );
}
