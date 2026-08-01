import { site } from "./site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/northa-lockup-dark.svg`,
    description: site.description,
    areaServed: { "@type": "State", name: "Sonora, México" },
    founder: { "@type": "Person", name: site.founder },
    email: site.contact.email,
    knowsAbout: [
      "Desarrollo de portales municipales",
      "Transparencia gubernamental",
      "Inteligencia artificial aplicada al gobierno",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "es-MX",
  };
}
