import { localizar } from "@/lib/i18n/localizar";
import { getUi } from "@/lib/i18n/ui";

// Identidad, contacto y URLs de Northa Digital.
// Solo datos reales: nada de aquí se inventa.

// Contacto predeterminado de todo el sitio: WhatsApp y correo. El número se
// guarda una vez, en formato internacional solo con dígitos (52 + 10 dígitos),
// y de él sale el enlace de WhatsApp. El sitio no ofrece llamadas ni muestra
// el número escrito: solo el botón de WhatsApp (ver lib/whatsapp.js).
const TELEFONO = "6622055021";
const TELEFONO_INTERNACIONAL = `52${TELEFONO}`;
const CORREO = "northadigital@gmail.com";

const CONTACTO = {
  email: CORREO,
  emailHref: `mailto:${CORREO}`,
  whatsappNumber: TELEFONO_INTERNACIONAL,
  whatsappHref: `https://wa.me/${TELEFONO_INTERNACIONAL}`,
};

export const site = {
  name: "Northa Digital",
  shortName: "Northa",
  // Textos por idioma: tagline, description y keywords (usa getSite(locale)).
  tagline: {
    es: "Diseño, sistemas y presencia digital",
    en: "Design, systems and digital presence",
  },
  description: {
    es: "Creamos portales, sistemas, sitios web, identidad visual y contenido digital para organizaciones que necesitan una presencia profesional y funcional.",
    en: "We build portals, systems, websites, visual identity and digital content for organizations that need a professional, functional online presence.",
  },
  keywords: {
    es: [
      "portales digitales",
      "sistemas digitales",
      "desarrollo web",
      "diseño gráfico",
      "redes sociales",
      "fotografía y video",
      "Northa Digital",
    ],
    en: [
      "digital portals",
      "digital systems",
      "web development",
      "graphic design",
      "social media",
      "photography and video",
      "Northa Digital",
    ],
  },
  // Dirección principal: la URL de producción en Vercel. Se puede sobrescribir
  // con NEXT_PUBLIC_SITE_URL cuando exista un dominio propio.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://northa-landing.vercel.app",
  founder: "Roberto Gil",

  contact: CONTACTO,
};

/** Los textos de `site` ya en un idioma (el resto de los datos no cambia). */
export function getSite(locale) {
  return {
    ...site,
    tagline: localizar(site.tagline, locale),
    description: localizar(site.description, locale),
    keywords: localizar(site.keywords, locale),
  };
}

/**
 * Texto completo del mensaje de WhatsApp: el saludo (con el nombre, si el
 * visitante lo dio) y, si hay, el cuerpo. Sale en el idioma de la página.
 */
export function textoWhatsapp(texto = "", nombre = "", locale = "es") {
  const ui = getUi(locale).whatsapp;
  const saludo = nombre ? ui.mensajeNombre(nombre) : ui.mensaje;
  return texto ? `${saludo}\n\n${texto}` : saludo;
}
