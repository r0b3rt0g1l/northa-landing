/**
 * Identidad, contacto y URLs de Northa Digital.
 *
 * Contacto confirmado por Roberto el 30-sep-2026: WhatsApp +52 662 205 5021 y
 * northadigital@gmail.com (el mismo número atiende Amplía).
 * Todo lo que puede cambiar entre entornos se puede sobreescribir con
 * variables de entorno — ver `.env.example`.
 */

/**
 * Ojo: las variables NEXT_PUBLIC_* se leen con acceso estático
 * (`process.env.NEXT_PUBLIC_X`) para que Next las incruste también en el
 * código del navegador (chat, "Arma tu proyecto"). `process.env[key]` no funciona ahí.
 */
const or = (value: string | undefined, fallback: string) =>
  value && value.trim() !== "" ? value.trim() : fallback;

const whatsappNumber = or(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, "526622055021");

export const site = {
  name: "Northa Digital",
  shortName: "Northa",
  /** URL canónica. Alimenta canonical, hreflang, sitemap, robots y Open Graph. */
  url: or(process.env.NEXT_PUBLIC_SITE_URL, "https://northadigital.com").replace(/\/$/, ""),
  founder: "Roberto Gil",
  foundingLocation: "Hermosillo, Sonora",
  tagline: { es: "El norte digital de Sonora", en: "Sonora's digital north" },
  subtagline: {
    es: "Software que se queda en producción.",
    en: "Software that stays in production.",
  },
  location: {
    city: "Hermosillo",
    region: "Sonora",
    regionCode: "SON",
    country: "MX",
    // Coordenadas aproximadas del centro de Hermosillo (para datos estructurados).
    geo: { latitude: 29.0729, longitude: -110.9559 },
  },
  contact: {
    email: or(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "northadigital@gmail.com"),
    whatsappNumber,
    phoneE164: `+${whatsappNumber}`,
    phoneDisplay: or(process.env.NEXT_PUBLIC_PHONE_DISPLAY, "+52 662 205 5021"),
  },
  /** Liga pública de Cal.com (p. ej. https://cal.com/northa/30min). Vacía = se oculta la agenda. */
  calUrl: or(process.env.NEXT_PUBLIC_CAL_URL, ""),
  /** Redes sociales confirmadas. Vacío a propósito: nada se publica sin confirmar. */
  sameAs: [] as string[],
} as const;

/**
 * Amplía Consultoría — sitio hermano.
 * Identidad y contacto del Apéndice A de ~/Developer/_material-amplia/PLAN-northa-amplia.md, textual.
 */
export const amplia = {
  name: "Amplía Consultoría",
  presenta: "Lic. Fabiola Kitazawa Galaz",
  contact: {
    phoneDisplay: "662 205 5021",
    phoneE164: "+526622055021",
    email: "ampliaconsul@gmail.com",
  },
} as const;
