import type { L, LList } from "@/lib/l10n";

/**
 * Apartado de gobierno. Todo el contenido sale de material ya verificado:
 *  - Flota: ~/Developer/cmsmunicipal/scripts/flota/flota.config.json (vía northa-landing/lib/content/flota.js).
 *  - `amplia: true`: verificado a mano contra las láminas 15-17 de ~/Developer/_material-amplia/.
 *  - Textos: referencia aprobada `referencia-visual-northa-amplia.html` y northa-landing/lib/content/*.js.
 */

export interface Municipio {
  slug: string;
  nombre: string;
  dominio: string;
  /** También acompañado por Amplía Consultoría (láminas 15–17). */
  amplia: boolean;
}

export const flota: Municipio[] = [
  { slug: "aconchi", nombre: "Aconchi", dominio: "www.aconchitransparencia.com.mx", amplia: true },
  { slug: "bacadehuachi", nombre: "Bacadéhuachi", dominio: "bacadehuachitransparencia.com.mx", amplia: true },
  { slug: "bacanora", nombre: "Bacanora", dominio: "bacanoratransparencia.com.mx", amplia: true },
  { slug: "banamichi", nombre: "Banámichi", dominio: "www.banamichitransparencia.com.mx", amplia: false },
  { slug: "baviacora", nombre: "Baviácora", dominio: "baviacoratransparencia.com.mx", amplia: false },
  { slug: "carbo", nombre: "Carbó", dominio: "carbotransparencia.com.mx", amplia: true },
  { slug: "cucurpe", nombre: "Cucurpe", dominio: "cucurpetransparencia.com.mx", amplia: false },
  { slug: "huachinera", nombre: "Huachinera", dominio: "www.huachineratransparencia.com.mx", amplia: false },
  { slug: "mazatan", nombre: "Mazatán", dominio: "mazatantransparencia.com.mx", amplia: true },
  { slug: "rayon", nombre: "Rayón", dominio: "www.rayontransparencia.com.mx", amplia: true },
  { slug: "sahuaripa", nombre: "Sahuaripa", dominio: "sahuaripatransparencia.com.mx", amplia: true },
  { slug: "sanjavier", nombre: "San Javier", dominio: "sanjaviertransparencia.com.mx", amplia: true },
  { slug: "soyopa", nombre: "Soyopa", dominio: "www.soyopatransparencia.com.mx", amplia: true },
  { slug: "tepache", nombre: "Tepache", dominio: "www.tepachetransparencia.com.mx", amplia: true },
];

export const flotaAmplia = flota.filter((m) => m.amplia);

export function escudoAlt(nombre: string, locale: "es" | "en") {
  return locale === "es" ? `Escudo de ${nombre}` : `Coat of arms of ${nombre}`;
}
export const flotaSinAmplia = flota.filter((m) => !m.amplia);

/** Cifras de la flota (referencia aprobada). Todas se derivan de datos verificables. */
export const govStats: { value: string; label: L }[] = [
  { value: String(flota.length), label: { es: "portales municipales en vivo", en: "live municipal portals" } },
  { value: String(flota.length), label: { es: "dominios .com.mx propios", en: "own .com.mx domains" } },
  { value: "1", label: { es: "panel para toda la flota", en: "admin panel for the whole fleet" } },
  { value: "0", label: { es: "cruces entre municipios", en: "cross-municipality data leaks" } },
];

/** "Qué construye Northa" — referencia aprobada. */
export const govPillars: { num: string; title: L; body: L }[] = [
  {
    num: "01 · PORTAL",
    title: { es: "Sitio institucional propio", en: "Its own institutional site" },
    body: {
      es: "Dominio .com.mx del municipio, certificado, y las secciones que la ley y el ciudadano esperan: gobierno, transparencia, turismo, noticias, contacto.",
      en: "The municipality's own .com.mx domain, certificate, and the sections the law and citizens expect: government, transparency, tourism, news, contact.",
    },
  },
  {
    num: "02 · PANEL",
    title: { es: "El municipio carga su contenido", en: "The municipality publishes its own content" },
    body: {
      es: "Un panel de administración con cuenta propia para cada ayuntamiento. Publican sus noticias y documentos sin depender de nadie.",
      en: "An admin panel with its own account for each municipality. They publish news and documents without depending on anyone.",
    },
  },
  {
    num: "03 · AISLAMIENTO",
    title: { es: "Cada municipio ve solo lo suyo", en: "Each municipality sees only its own data" },
    body: {
      es: "Una sola plataforma para los catorce, con separación verificada entre municipios: ninguna cuenta alcanza los datos de otro ayuntamiento.",
      en: "One platform for all fourteen, with verified separation: no account can reach another municipality's data.",
    },
  },
  {
    num: "04 · PROCEDENCIA",
    title: { es: "Nada se inventa", en: "Nothing is made up" },
    body: {
      es: "Escudo, redes y datos históricos se publican con fuente confirmada por el ayuntamiento, o no se publican. Un portal de gobierno no es lugar para rellenar huecos.",
      en: "Coats of arms, social links and historical facts are published with a source confirmed by the municipality, or not at all. A government portal is no place to fill gaps.",
    },
  },
];

/** Módulos del portal — northa-landing/lib/content/servicios.js. */
export const govModules: { icon: "landmark" | "shield" | "dashboard" | "news" | "users" | "camera"; title: L; body: L }[] = [
  {
    icon: "landmark",
    title: { es: "Portal institucional", en: "Institutional portal" },
    body: {
      es: "Un sitio municipal completo, rápido y elegante, a la altura de los gobiernos más modernos del país.",
      en: "A complete, fast and elegant municipal site, on par with the most modern governments in the country.",
    },
  },
  {
    icon: "shield",
    title: { es: "Transparencia y obligaciones", en: "Transparency obligations" },
    body: {
      es: "Publica y mantén al día tus obligaciones de transparencia (LGCG/LDF, SEvAC) de forma ordenada y consultable.",
      en: "Publish and keep your transparency obligations (LGCG/LDF, SEvAC) up to date, organized and searchable.",
    },
  },
  {
    icon: "dashboard",
    title: { es: "Panel de administración en español", en: "Admin panel in Spanish" },
    body: {
      es: "Tu equipo actualiza noticias, documentos y contenido desde un panel pensado para el flujo real de un ayuntamiento.",
      en: "Your team updates news, documents and content from a panel designed for how a municipality actually works.",
    },
  },
  {
    icon: "news",
    title: { es: "Noticias y acciones de gobierno", en: "News and government actions" },
    body: {
      es: "Comunica obras, programas y logros con una sección de noticias siempre al día.",
      en: "Share public works, programs and results with an always up-to-date news section.",
    },
  },
  {
    icon: "users",
    title: { es: "Directorio y cabildo", en: "Directory and council" },
    body: {
      es: "Estructura orgánica, directorio y cabildo presentados con claridad: quién es quién y a dónde acudir.",
      en: "Organizational structure, directory and council presented clearly: who's who and where to go.",
    },
  },
  {
    icon: "camera",
    title: { es: "Turismo y galería", en: "Tourism and gallery" },
    body: {
      es: "Lo mejor del municipio en galerías y fichas de turismo, con imágenes nítidas y carga veloz.",
      en: "The best of the municipality in galleries and tourism pages, with sharp images and fast loading.",
    },
  },
];

/** Pilares de calidad — northa-landing/lib/content/pilares.js (claims aprobados). */
export const govQuality: { icon: "gauge" | "lock" | "a11y" | "eyeoff"; title: L; badge: string; points: LList }[] = [
  {
    icon: "gauge",
    title: { es: "Rendimiento", en: "Performance" },
    badge: "AVIF · WebP",
    points: {
      es: [
        "Imágenes en AVIF y WebP, optimizadas vía CDN global.",
        "Páginas pre-renderizadas servidas desde una red edge.",
        "Rendimiento real (Core Web Vitals) medido en producción.",
      ],
      en: [
        "AVIF and WebP images, optimized through a global CDN.",
        "Pre-rendered pages served from an edge network.",
        "Real-user performance (Core Web Vitals) measured in production.",
      ],
    },
  },
  {
    icon: "lock",
    title: { es: "Seguridad", en: "Security" },
    badge: "Tokens firmados",
    points: {
      es: [
        "Contraseñas cifradas y autenticación con tokens firmados.",
        "Control de acceso por roles en cada operación sensible.",
        "Credenciales jamás expuestas al navegador del ciudadano.",
      ],
      en: [
        "Hashed passwords and signed-token authentication.",
        "Role-based access control on every sensitive operation.",
        "Credentials never exposed to the citizen's browser.",
      ],
    },
  },
  {
    icon: "a11y",
    title: { es: "Accesibilidad", en: "Accessibility" },
    badge: "WCAG",
    points: {
      es: [
        "Navegación por teclado, foco visible y estructura semántica.",
        "Soporte de movimiento reducido para quien lo prefiere.",
        "Componentes construidos alrededor del estándar WAI-ARIA.",
      ],
      en: [
        "Keyboard navigation, visible focus and semantic structure.",
        "Reduced-motion support for those who prefer it.",
        "Components built around the WAI-ARIA standard.",
      ],
    },
  },
  {
    icon: "eyeoff",
    title: { es: "Privacidad", en: "Privacy" },
    badge: "0 rastreadores",
    points: {
      es: [
        "Sin Google Analytics, sin Facebook Pixel, sin scripts publicitarios.",
        "Analítica sin cookies personales.",
        "Los formularios llegan al correo institucional del municipio.",
      ],
      en: [
        "No Google Analytics, no Facebook Pixel, no ad scripts.",
        "Analytics without personal cookies.",
        "Form submissions go to the municipality's official email.",
      ],
    },
  },
];
