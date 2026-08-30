// Identidad, contacto y URLs de Northa Digital.

export const site = {
  name: "Northa Digital",
  shortName: "Northa",
  tagline: "El norte de tu gobierno digital",
  description:
    "Estudio de gobierno digital especializado en municipios de Sonora. Desarrollamos portales institucionales, transparencia gestionable e inteligencia artificial aplicada a la administración pública.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://northa.digital",
  locale: "es_MX",
  location: "Sonora, México",
  founder: "Roberto Gil",

  contact: {
    email: "rgilh@hotmail.com",
    emailHref: "mailto:rgilh@hotmail.com",
    whatsappDisplay: "+52 662 386 6834",
    whatsappHref: "https://wa.me/526623866834",
  },

  // Caso en vivo destacado.
  demo: {
    label: "Portal de San Javier",
    url: "https://sanjaviertransparencia.com.mx",
  },
};

export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";
