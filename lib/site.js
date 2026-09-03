// Identidad, contacto y URLs de Northa Digital.

export const site = {
  name: "Northa Digital",
  shortName: "Northa",
  tagline: "El norte de tu gobierno digital",
  description:
    "Software e inteligencia artificial para ayuntamientos de Sonora. Catorce portales municipales en producción, con Amplía Consultoría como aliada en gestión pública.",
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

  // Amplía Consultoría — la otra mitad del despacho. Identidad y contacto del
  // Apéndice A de ~/Developer/_material-amplia/PLAN-northa-amplia.md, verbatim.
  amplia: {
    name: "Amplía Consultoría",
    presenta: "Lic. Fabiola Kitazawa Galaz",
    contact: {
      tel: "662 205 5021",
      email: "ampliaconsul@gmail.com",
      emailHref: "mailto:ampliaconsul@gmail.com",
    },
  },
};

// Clave pública de Web3Forms para ContactoForm. Vacía hasta que se configure
// NEXT_PUBLIC_WEB3FORMS_KEY en Vercel — el formulario renderiza igual, solo
// no envía hasta entonces.
export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";
