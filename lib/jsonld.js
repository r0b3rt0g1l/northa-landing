import { getSite } from "./site";
import { getServicios, getSeguridad } from "./content/servicios";
import { inLanguage } from "./i18n/config";
import { urlInicio } from "./seo";

export function organizationJsonLd(locale = "es") {
  const site = getSite(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: urlInicio(locale),
    logo: `${site.url}/northa-lockup-dark.svg`,
    description: site.description,
    founder: { "@type": "Person", name: site.founder },
    email: site.contact.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: site.contact.whatsappHref,
      email: site.contact.email,
      availableLanguage: [locale],
    },
    knowsAbout: [...getServicios(locale).map((s) => s.title), getSeguridad(locale).title],
  };
}

export function websiteJsonLd(locale = "es") {
  const site = getSite(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: urlInicio(locale),
    inLanguage: inLanguage[locale],
  };
}
