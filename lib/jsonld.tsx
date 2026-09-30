import { site, amplia } from "./site";
import { htmlLang, type Locale } from "./i18n/config";
import { absoluteUrl } from "./i18n/href";
import { t, type L } from "./l10n";
import type { Service } from "@/content/services";

type Json = Record<string, unknown>;

/** Inserta JSON-LD de forma segura (escapa "<" para evitar inyección). */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const orgId = `${site.url}/#organization`;

export function organizationJsonLd(locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/icon-512.png`,
    image: `${site.url}/cerro/dusk-wide.jpg`,
    slogan: site.tagline[locale],
    description:
      locale === "es"
        ? "Estudio de software e inteligencia artificial en Hermosillo, Sonora: páginas web, sistemas a la medida, apps, IA y portales de gobierno."
        : "Software and AI studio in Hermosillo, Sonora: websites, custom systems, apps, AI and government portals.",
    founder: { "@type": "Person", name: site.founder },
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.location.geo.latitude,
      longitude: site.location.geo.longitude,
    },
    areaServed: [
      { "@type": "State", name: "Sonora" },
      { "@type": "Country", name: "México" },
    ],
    knowsLanguage: ["es-MX", "en"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.contact.phoneE164,
      email: site.contact.email,
      availableLanguage: ["Spanish", "English"],
    },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export function websiteJsonLd(locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: absoluteUrl(site.url, locale, "/"),
    inLanguage: htmlLang[locale],
    publisher: { "@id": orgId },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceJsonLd(service: Service, locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t(service.seoTitle, locale),
    serviceType: t(service.name, locale),
    description: t(service.seoDescription, locale),
    url: absoluteUrl(site.url, locale, `/servicios/${service.slug}`),
    provider: { "@id": orgId },
    areaServed: { "@type": "State", name: "Sonora" },
    inLanguage: htmlLang[locale],
  };
}

export function faqJsonLd(items: { q: L; a: L }[], locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: t(item.q, locale),
      acceptedAnswer: { "@type": "Answer", text: t(item.a, locale) },
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  date,
  locale,
  image,
}: {
  title: string;
  description: string;
  url: string;
  date: string;
  locale: Locale;
  image: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: date,
    dateModified: date,
    inLanguage: htmlLang[locale],
    image,
    author: { "@type": "Person", name: site.founder },
    publisher: { "@id": orgId },
    mainEntityOfPage: url,
  };
}

export function ampliaJsonLd(locale: Locale, description: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: amplia.name,
    url: absoluteUrl(site.url, locale, "/amplia"),
    description,
    telephone: amplia.contact.phoneE164,
    areaServed: { "@type": "State", name: "Sonora" },
    member: { "@type": "Person", name: amplia.presenta },
  };
}

/** Portafolio: colección de trabajos publicados (solo los que tienen URL pública o página propia). */
export function portfolioJsonLd({
  locale,
  name,
  description,
  items,
}: {
  locale: Locale;
  name: string;
  description: string;
  items: { name: string; url: string; description: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(site.url, locale, "/portfolio"),
    inLanguage: htmlLang[locale],
    publisher: { "@id": orgId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "CreativeWork", name: item.name, url: item.url, description: item.description, creator: { "@id": orgId } },
      })),
    },
  };
}
