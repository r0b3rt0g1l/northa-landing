// Idiomas del sitio. El español es el idioma por defecto y vive en la raíz
// («/»); el inglés vive en «/en». El proxy (proxy.js) reescribe «/» a «/es»
// por dentro, así que las URL en español no cambian.
export const locales = ["es", "en"];
export const defaultLocale = "es";

export const esLocale = (l) => locales.includes(l);

export const otroIdioma = (locale) => (locale === "en" ? "es" : "en");

/** Valores por idioma que usan los metadatos y los datos estructurados. */
export const ogLocale = { es: "es_MX", en: "en_US" };
export const inLanguage = { es: "es-MX", en: "en-US" };

/** Ruta de la portada: «/» en español, «/en» en inglés. */
export const rutaInicio = (locale) => (locale === "en" ? "/en" : "/");

/** Enlace a una sección de la portada: «/#servicios» o «/en#servicios». */
export const hrefSeccion = (locale, id) => (locale === "en" ? `/en#${id}` : `/#${id}`);
