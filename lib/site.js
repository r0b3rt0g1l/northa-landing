// Identidad, contacto y URLs de Northa Digital.

export const site = {
  name: "Northa Digital",
  shortName: "Northa",
  tagline: "El norte de tu gobierno digital",
  description:
    "Dos empresas, una misma oficina y un solo recorrido: primero se ordena la gestión, después se publica. Amplía Consultoría y Northa Digital, para los ayuntamientos de Sonora.",
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
