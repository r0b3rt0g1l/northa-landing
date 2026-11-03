import { getAsistente } from "./content/asistente";
import { porIdioma } from "@/lib/i18n/localizar";

/** Minúsculas, sin acentos ni signos: "¿Cuánto cuesta?" → "cuanto cuesta". */
export function normalizar(texto = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Motor de temas de un idioma: dado un texto libre, elige el tema de Nora que
 * mejor le responde. Las claves se normalizan una vez por idioma.
 */
export const getMotor = porIdioma((locale) => {
  const { temas, textos } = getAsistente(locale);
  const porId = new Map(temas.map((t) => [t.id, t]));

  // Las claves con espacio son frases; las que terminan en "*" son prefijos
  // ("cotiz*" → cotizar, cotización); el resto, solo la palabra exacta.
  const indice = temas.map((t, orden) => {
    const claves = t.claves.map((c) => ({ prefijo: c.endsWith("*"), texto: normalizar(c) }));
    return {
      tema: t,
      orden,
      peso: t.peso ?? 1,
      frases: claves.filter((c) => c.texto.includes(" ")).map((c) => c.texto),
      palabras: claves.filter((c) => c.texto && !c.texto.includes(" ")),
    };
  });

  function puntuar(entrada, palabrasEntrada) {
    const texto = ` ${palabrasEntrada.join(" ")} `;
    let puntos = 0;
    // Las palabras que ya cuentan dentro de una frase no suman otra vez.
    const usadas = new Set();
    for (const f of entrada.frases) {
      if (texto.includes(` ${f} `)) {
        puntos += 3;
        f.split(" ").forEach((p) => usadas.add(p));
      }
    }
    // Cada palabra del visitante cuenta una sola vez, con su mejor coincidencia.
    for (const p of palabrasEntrada) {
      if (usadas.has(p)) continue;
      let mejor = 0;
      for (const clave of entrada.palabras) {
        if (p === clave.texto) {
          mejor = 2;
          break;
        }
        if (clave.prefijo && p.startsWith(clave.texto)) mejor = 1.5;
      }
      puntos += mejor;
    }
    return puntos * entrada.peso;
  }

  /** El tema que mejor responde a un texto libre, o { tema: null }. */
  function interpretar(texto) {
    const palabras = normalizar(texto).split(" ").filter(Boolean);
    if (!palabras.length) return { tema: null, puntos: 0 };
    const ranking = indice
      .map((e) => ({ e, puntos: puntuar(e, palabras) }))
      .filter((r) => r.puntos > 0)
      .sort((a, b) => b.puntos - a.puntos || a.e.orden - b.e.orden);
    return { tema: ranking[0]?.e.tema ?? null, puntos: ranking[0]?.puntos ?? 0 };
  }

  return { temas, textos, interpretar, temaPorId: (id) => porId.get(id) ?? null };
});
