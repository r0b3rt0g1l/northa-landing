import { getMotor, normalizar } from "./asistente";
import { site, textoWhatsapp } from "./site";
import { porIdioma } from "./i18n/localizar";

// Conversación de Nora: solo texto, sin botones. Cada turno recibe la memoria
// de la conversación y lo que escribió el visitante, y devuelve la memoria
// nueva y la respuesta en «partes» (texto y enlaces) lista para pintar.
//
// Memoria (se guarda en la sesión del navegador, nunca en un servidor):
//   nombre, contacto, esCorreo  → datos que el visitante ya dio (no se repiten)
//   interes                     → lo que busca («una tienda en línea»)
//   asunto                      → breve descripción para el equipo
//   pendiente                   → Nora está juntando datos para pasar el caso
//   espera                      → Nora acaba de hacer una pregunta sobre el proyecto
//
// Al pasar un caso, Nora arma un mensaje para WhatsApp que el visitante revisa
// y envía; nada sale solo.

// Lo que depende de la lengua: cómo se reconocen preguntas, nombres, datos
// sensibles, groserías y un «no, gracias».
const LENGUA = {
  es: {
    pregunta: /^(que|cuanto|cuanta|cuantos|cuantas|como|cual|cuales|donde|cuando|por que|porque|hacen|tienen|pueden|manejan|ofrecen|es|son|puedo|me pueden|quien|trabajan)\b/,
    sensible: /contrasena|password|\bnip\b|\bcvv\b|numero de (mi )?tarjeta|tarjeta de credito|tarjeta de debito|clave de acceso/,
    insulto: /\b(idiota|estupid[oa]|pendej\w*|imbecil|inutil|basura|mierda|ching\w*|put[oa]|verga|culer[oa]|tont[oa])\b/,
    cancelar: /^(no|nop|nel|no gracias|mejor no|olvidalo|despues|luego|ahorita no|asi esta bien|asi estoy bien)$/,
    nombre: /(?:me llamo|mi nombre es|soy)\s+([a-záéíóúüñ]+(?:\s+[a-záéíóúüñ]+){0,2})/i,
    conectores: new Set(["y", "e", "con", "de", "del", "la", "el", "los", "las", "un", "una", "mi", "tu", "su", "para", "por", "que", "pero"]),
    noNombre: new Set([
      "de", "del", "el", "la", "un", "una", "nuevo", "nueva", "dueno", "duena", "encargado", "encargada", "gerente",
      "director", "directora", "muy", "bien", "yo", "quien", "cliente", "interesado", "interesada", "parte",
    ]),
    // Palabras que no son un nombre propio (para reconocer «Ana López, ana@…»).
    comunes: /\b(quiero|necesito|busco|tengo|me|interesa|pagina|sitio|web|tienda|sistema|logo|proyecto|cotizacion|hola|buenas|gracias|si|no|para|una|un|el|la|mi|correo|telefono|whatsapp|urgente)\b/,
    saludos: /^(hola|holi|buenas( tardes| noches)?|buenos dias|buen dia|que tal)[,.!\s]*/i,
    // «mi cel es», «mi correo:»: anuncian un dato, no describen el asunto.
    anuncioDato: /\b(mi\s+)?(cel|celular|correo|email|mail|telefono|teléfono|tel|numero|número|whats|whatsapp)(\s+es|\s*:)?/gi,
  },
  en: {
    pregunta: /^(what|how|why|when|where|which|who|do|does|can|could|is|are|will|would|should)\b/,
    sensible: /password|\bpin\b|\bcvv\b|card number|credit card|debit card|login details/,
    insulto: /\b(idiot|stupid|useless|fuck\w*|shit\w*|dumb|moron|trash|garbage)\b/,
    cancelar: /^(no|nope|no thanks|no thank you|never ?mind|forget it|later|not now|maybe later)$/,
    nombre: /(?:my name is|i'?m|i am|this is|it'?s)\s+([a-z]+(?:\s+[a-z]+){0,2})/i,
    conectores: new Set(["and", "with", "from", "of", "the", "a", "an", "my", "your", "for", "to", "but", "that"]),
    noNombre: new Set([
      "a", "an", "the", "from", "interested", "looking", "not", "just", "so", "very", "here", "new", "owner", "manager",
      "trying", "having", "calling", "writing", "sure", "fine", "good", "ok", "okay",
    ]),
    comunes: /\b(want|need|looking|have|website|site|web|store|system|logo|project|quote|hello|hi|thanks|yes|no|for|my|email|phone|whatsapp|urgent)\b/,
    saludos: /^(hi|hello|hey|good (morning|afternoon|evening))[,.!\s]*/i,
    anuncioDato: /\b(my\s+)?(cell|cellphone|phone|email|e-mail|mail|number|whatsapp)(\s+is|\s*:)?/gi,
  },
};

// Temas que invitan al visitante a contar su proyecto: su respuesta (si no es
// otra pregunta) se toma como contexto y Nora ofrece pasarlo al equipo.
const INVITAN = new Set([
  "no-se", "presencia", "tecnologia", "costos", "presupuesto", "tiempos", "servicios", "para-quien", "mantenimiento", "trabajo",
]);
// Intenciones claras que se responden aunque Nora acabe de hacer una pregunta;
// cualquier otra frase (no pregunta) se lee como respuesta sobre el proyecto.
const SIEMPRE = new Set(["gracias", "despedida", "asistente", "otra-cosa", "no-se", "tecnologia", "presupuesto"]);

const EMAIL = /[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]{2,}/;
const TELEFONO = /\+?\d[\d\s().-]{6,}\d/g;

const capitalizar = (t) => t.replace(/(^|\s)(\p{L})/gu, (_, e, l) => e + l.toUpperCase());
/** Solo la primera letra en mayúscula: «una tienda en línea» → «Una tienda en línea». */
const primeraMayuscula = (t) => t.replace(/^\p{L}/u, (l) => l.toUpperCase());
const contarPalabras = (t) => normalizar(t).split(" ").filter(Boolean).length;

/** Un número de tarjeta (14 a 19 dígitos seguidos, con o sin espacios). */
const pareceTarjeta = (texto) => /\d{14,19}/.test(texto.replace(/[\s-]/g, ""));

function buscarTelefono(texto) {
  for (const m of texto.match(TELEFONO) ?? []) {
    const digitos = m.replace(/\D/g, "").length;
    if (digitos >= 10 && digitos <= 13) return m.trim();
  }
  return null;
}

function crear(locale) {
  const { interpretar, textos: T } = getMotor(locale);
  const L = LENGUA[locale] ?? LENGUA.es;

  // ---------- Partes de una respuesta ----------

  /**
   * Convierte el texto con enlaces [texto](destino) en partes para pintar.
   * «whatsapp:» abre el chat con `whatsapp` como mensaje; «correo:» abre el
   * correo (con `correo` como cuerpo, si hay); «#id» lleva a una sección.
   */
  function enPartes(texto, { whatsapp, correo } = {}) {
    const partes = [];
    let ultimo = 0;
    for (const m of texto.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
      if (m.index > ultimo) partes.push({ t: "texto", v: texto.slice(ultimo, m.index) });
      const [, v, destino] = m;
      if (destino === "whatsapp:") partes.push({ t: "whatsapp", v, mensaje: whatsapp });
      else if (destino === "correo:") {
        const query = correo ? `?subject=${encodeURIComponent(T.asuntoCorreo)}&body=${encodeURIComponent(correo)}` : "";
        partes.push({ t: "enlace", v, href: `${site.contact.emailHref}${query}` });
      } else if (destino.startsWith("#")) partes.push({ t: "seccion", v, id: destino.slice(1) });
      else partes.push({ t: "enlace", v, href: destino });
      ultimo = m.index + m[0].length;
    }
    if (ultimo < texto.length) partes.push({ t: "texto", v: texto.slice(ultimo) });
    return partes;
  }

  const responder = (memoria, texto, extra) => ({
    memoria,
    partes: enPartes(texto, { whatsapp: textoWhatsapp("", memoria.nombre ?? "", locale), ...extra }),
  });

  // ---------- Datos para pasar el caso ----------

  function limpiarNombre(crudo) {
    const palabras = [];
    for (const p of crudo.trim().split(/\s+/)) {
      const n = normalizar(p);
      if (!n || L.conectores.has(n)) break;
      palabras.push(p);
    }
    if (!palabras.length || L.noNombre.has(normalizar(palabras[0]))) return null;
    return capitalizar(palabras.slice(0, 3).join(" ").toLowerCase());
  }

  /** Nombre, contacto y asunto que trae un mensaje, según lo que aún falta. */
  function extraer(texto, m) {
    const datos = {};
    let resto = texto;

    const email = texto.match(EMAIL)?.[0];
    const telefono = email ? null : buscarTelefono(texto);
    if (email || telefono) {
      datos.contacto = (email ?? telefono).replace(/[.,;]+$/, "");
      datos.esCorreo = !!email;
      resto = resto.replace(email ?? telefono, " ");
    } else if (/@|\d{4,}/.test(texto) && !m.contacto) {
      datos.contactoMalo = true;
    }

    if (!m.nombre) {
      const porFrase = resto.match(L.nombre);
      const nombre = porFrase ? limpiarNombre(porFrase[1]) : null;
      if (nombre) {
        datos.nombre = nombre;
        resto = resto.replace(porFrase[0], " ");
      } else {
        // «Ana López, ana@correo.com, quiero…»: un trozo corto que parece nombre.
        const trozos = resto.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
        const soloFalta = m.asunto || m.interes;
        const candidato = trozos.find(
          (s) => /^[\p{L}\s'-]+$/u.test(s) && contarPalabras(s) <= 3 && !L.comunes.test(normalizar(s)),
        );
        if (candidato && (trozos.length > 1 || datos.contacto || soloFalta)) {
          const limpio = limpiarNombre(candidato);
          if (limpio) {
            datos.nombre = limpio;
            resto = resto.replace(candidato, " ");
          }
        }
      }
    }

    if (!m.asunto) {
      let descripcion = resto
        .replace(L.saludos, "")
        .replace(L.anuncioDato, " ")
        .replace(/\s+/g, " ")
        .replace(/^[\s,.;:!-]+|[\s,.;:!-]+$/g, "");
      // Sin conectores sueltos al principio o al final («y», «and»…).
      let palabras = descripcion.split(" ");
      while (palabras.length && L.conectores.has(normalizar(palabras[0]))) palabras.shift();
      while (palabras.length && L.conectores.has(normalizar(palabras.at(-1)))) palabras.pop();
      descripcion = palabras.join(" ").replace(/^[\s,.;:!-]+|[\s,.;:!-]+$/g, "");
      const yaHayResto = (m.nombre || datos.nombre) && (m.contacto || datos.contacto);
      if (contarPalabras(descripcion) >= 3 || (yaHayResto && contarPalabras(descripcion) >= 2)) datos.asunto = descripcion;
    }
    return datos;
  }

  /** Lo que falta para pasar el caso o, si ya está todo, el mensaje listo. */
  function avanzar(m, prefijo = "") {
    const asunto = m.asunto || (m.interes ? primeraMayuscula(m.interes) : "");
    const falta = { asunto: !asunto, nombre: !m.nombre, contacto: !m.contacto };

    if (!falta.asunto && !falta.nombre && !falta.contacto) {
      const cuerpo = T.mensaje({ asunto, contacto: m.contacto, esCorreo: m.esCorreo });
      const memoria = { ...m, pendiente: false, espera: false, asunto: undefined };
      return {
        memoria,
        partes: enPartes(T.listo(m.nombre), {
          whatsapp: textoWhatsapp(cuerpo, m.nombre, locale),
          correo: textoWhatsapp(cuerpo, m.nombre, locale),
        }),
      };
    }

    const F = T.faltan;
    let pide;
    if (falta.asunto && falta.nombre && falta.contacto) pide = F.todo;
    else if (falta.nombre && falta.contacto) pide = F.nombreContacto;
    else if (falta.asunto && falta.contacto) pide = F.asuntoContacto(m.nombre);
    else if (falta.asunto && falta.nombre) pide = F.asuntoNombre;
    else if (falta.contacto) pide = F.contacto(m.nombre);
    else if (falta.nombre) pide = F.nombre;
    else pide = F.asunto(m.nombre);
    return responder({ ...m, pendiente: true, espera: false }, prefijo ? `${prefijo} ${pide}` : pide);
  }

  /** Aplica los datos encontrados a la memoria. */
  const conDatos = (m, d) => ({
    ...m,
    ...(d.nombre ? { nombre: d.nombre } : {}),
    ...(d.contacto ? { contacto: d.contacto, esCorreo: d.esCorreo } : {}),
    ...(d.asunto ? { asunto: d.asunto } : {}),
  });

  // ---------- Un turno ----------

  /**
   * Responde a lo que escribió el visitante. Varios mensajes seguidos llegan
   * aquí ya unidos (el panel los junta mientras Nora «escribe»).
   */
  function procesar(memoria, texto) {
    const m = { ...memoria };
    const e = normalizar(texto);
    if (!e) return null;

    // Datos sensibles: no se guardan y se pide no compartirlos.
    if (L.sensible.test(e) || pareceTarjeta(texto)) return responder(m, T.sensible);

    // Molestia o groserías: calma y ofrecer al equipo.
    if (L.insulto.test(e)) return responder({ ...m, pendiente: true, espera: false }, T.molesto);

    if (m.pendiente && L.cancelar.test(e)) {
      return responder({ ...m, pendiente: false, espera: false, asunto: undefined }, T.cancelar);
    }

    // Los temas se buscan sin correos ni teléfonos («ana@ejemplo.com» no habla de ejemplos).
    const sinContacto = texto.replace(EMAIL, " ").replace(TELEFONO, " ");
    const { tema } = interpretar(sinContacto);
    const esPregunta = /[¿?]/.test(texto) || L.pregunta.test(e);

    // Juntando datos para el equipo.
    if (m.pendiente) {
      if (tema && esPregunta && !tema.deriva) {
        const siguiente = { ...m, ...(tema.interes ? { interes: tema.interes } : {}) };
        return responder(siguiente, `${tema.responder(e)}\n\n${T.recordatorio}`);
      }
      const datos = extraer(texto, m);
      if (datos.nombre || datos.contacto || datos.asunto) return avanzar(conDatos(m, datos));
      if (datos.contactoMalo) return responder(m, T.contactoInvalido);
      // Solo faltaba el nombre y escribió algo corto: es su nombre.
      if (!m.nombre && (m.asunto || m.interes) && m.contacto && contarPalabras(texto) <= 3) {
        const nombre = limpiarNombre(texto.replace(L.nombre, "$1"));
        if (nombre) return avanzar({ ...m, nombre });
      }
      return avanzar(m);
    }

    // Dejó su correo o teléfono sin que se lo pidieran: quiere que lo contacten.
    if (EMAIL.test(texto) || buscarTelefono(texto)) {
      const siguiente = { ...m, pendiente: true, espera: false };
      return avanzar(conDatos(siguiente, extraer(texto, siguiente)));
    }

    // Un tema que pide al equipo (cotización, urgencia, hablar con alguien…).
    if (tema?.deriva) {
      let siguiente = { ...m, pendiente: true, espera: false, ...(tema.interes ? { interes: tema.interes } : {}) };
      const datos = extraer(texto, siguiente);
      // El propio mensaje cuenta como asunto solo si es una descripción larga.
      if (datos.asunto && contarPalabras(datos.asunto) < 8) delete datos.asunto;
      siguiente = conDatos(siguiente, datos);
      const yaConocido = memoria.nombre || memoria.contacto || datos.nombre || datos.contacto;
      if (yaConocido) return avanzar(siguiente, tema.id === "persona" || tema.id === "cotizacion" ? T.claro : "");
      return responder(siguiente, tema.responder(e));
    }

    // Respuesta a una pregunta de Nora sobre el proyecto: se toma como contexto
    // y se ofrece pasarlo al equipo.
    if (m.espera && !esPregunta && !SIEMPRE.has(tema?.id)) {
      // Pesa más el tema sobre el que Nora preguntó que una palabra suelta de la respuesta.
      const interes = m.interes ?? tema?.interes;
      const dicho = texto.trim().replace(/\s*\n+\s*/g, ", ");
      const asunto = interes ? `${primeraMayuscula(interes)}: ${dicho}` : dicho;
      return avanzar(conDatos({ ...m, interes, asunto }, extraer(texto, { ...m, asunto })), T.seguimiento);
    }

    if (tema) {
      const siguiente = {
        ...m,
        ...(tema.interes ? { interes: tema.interes } : {}),
        espera: !!tema.interes || INVITAN.has(tema.id),
      };
      return responder(siguiente, tema.responder(e));
    }

    return responder({ ...m, espera: false }, T.noEntendido);
  }

  // ---------- Entradas desde la página ----------

  /** Saludo al abrir el chat por primera vez. */
  const saludo = () => responder({}, T.saludoInicial);

  /** El visitante llegó desde un servicio de la página. */
  function abrirServicio(memoria, servicioId, alInicio) {
    const s = T.servicios[servicioId];
    if (!s) return alInicio ? saludo() : null;
    const m = { ...memoria, interes: s, espera: true };
    return responder(m, alInicio ? T.saludoServicio(s) : T.servicio(s));
  }

  /** «Hablar con una persona» desde fuera del chat. */
  function pedirPersona(memoria) {
    const m = { ...memoria, pendiente: true, espera: false };
    if (m.nombre || m.contacto) return avanzar(m, T.claro);
    return responder(m, getMotor(locale).temaPorId("persona").responder(""));
  }

  return { procesar, saludo, abrirServicio, pedirPersona };
}

export const getNora = porIdioma(crear);

/** Texto plano de una respuesta (para lectores de pantalla y la animación). */
export const textoDe = (partes = []) => partes.map((p) => p.v).join("");
