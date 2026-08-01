// Identidad, contacto y URLs de Northa Digital.

export const site = {
  name: "Northa Digital",
  shortName: "Northa",
  tagline: "El norte de tu gobierno digital",
  description:
    "Estudio especializado en gobierno municipal de Sonora. Construimos portales institucionales de última generación, transparencia gestionable y servicios de inteligencia artificial al servicio del ciudadano.",
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
    url: "https://sanjavier-gobierno.vercel.app",
  },
};

export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";
