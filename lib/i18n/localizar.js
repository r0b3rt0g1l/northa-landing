// Los textos con dos idiomas se escriben como { es: "…", en: "…" }.
// `localizar` recorre un dato (objetos, listas) y deja solo el idioma pedido;
// todo lo demás (íconos, números, funciones) pasa tal cual.

const esObjetoPlano = (v) =>
  v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype && !("$$typeof" in v);

const esTraduccion = (v) => {
  if (!esObjetoPlano(v)) return false;
  const claves = Object.keys(v);
  return claves.length === 2 && "es" in v && "en" in v;
};

export function localizar(valor, locale) {
  if (esTraduccion(valor)) return valor[locale] ?? valor.es;
  if (Array.isArray(valor)) return valor.map((v) => localizar(v, locale));
  if (esObjetoPlano(valor)) {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, localizar(v, locale)]));
  }
  return valor;
}

/** Calcula una vez por idioma y recuerda el resultado. */
export function porIdioma(fn) {
  const cache = new Map();
  return (locale) => {
    if (!cache.has(locale)) cache.set(locale, fn(locale));
    return cache.get(locale);
  };
}
