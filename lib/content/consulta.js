import { porIdioma } from "@/lib/i18n/localizar";

// Conversación guiada del asistente: pocas preguntas, directas, que terminan
// en un mensaje para WhatsApp que el visitante revisa y envía. Todo es
// contenido predefinido: no hay inteligencia artificial ni atención en tiempo
// real. Las opciones salen de los servicios reales; no se prometen precios,
// plazos, funciones ni integraciones.
//
// Datos que se recogen (solo viajan en el mensaje que el visitante envía):
// tipo de proyecto, municipio u organización, necesidad principal, nombre y
// forma de contacto. El nombre, la organización y el correo son opcionales.
//
// La lógica es una sola (`crear`); lo que cambia entre idiomas vive en un
// «paquete» por idioma (PACKS): textos, opciones, palabras que se reconocen
// en lo que escribe el visitante y las expresiones regulares que dependen de
// la lengua. getConsulta(locale) devuelve la conversación ya armada.

const PACKS = {
  // ------------------------------------------------------------------ es
  es: {
    TIPO_NO_SE: "No estoy seguro",
    OPCION_OTRA: "Algo más",
    OPCION_RESERVA: "Prefiero no decirlo",

    /** Tipos de proyecto, en el orden en que se ofrecen. */
    tipos: [
      { id: "portal", label: "Portal municipal" },
      { id: "web", label: "Página web" },
      { id: "sistema", label: "Sistema administrativo" },
      { id: "contenido", label: "Contenido y diseño" },
    ],

    /** Para quien no sabe qué necesita (el primero sugiere un portal; el resto, una web). */
    ambitos: ["Un municipio", "Un negocio", "Un proyecto personal", "Otra organización"],

    /** Lo principal que se necesita, según el tipo de proyecto. */
    necesidades: {
      portal: ["Información pública", "Turismo", "Trámites", "Formularios", "Galería"],
      web: ["Presentar mi negocio o proyecto", "Mostrar servicios", "Galería", "Formularios de contacto"],
      sistema: ["Organizar información", "Formularios y registros", "Accesos por usuario", "Protección y control de acceso"],
      contenido: ["Redes sociales", "Fotografía", "Video", "Diseño gráfico"],
    },

    formasContacto: ["WhatsApp", "Correo"],

    // Palabras que identifican cada tipo en un texto libre. Una clave coincide
    // con una palabra que empieza igual («administrativ» → administrativo), o
    // con la palabra exacta si termina en «=», o como frase si lleva espacio.
    palabrasTipo: {
      portal: ["municipio", "municipal", "ayuntamiento", "alcaldia", "cabildo", "portal", "gobierno", "transparencia", "turis"],
      web: ["pagina", "sitio", "web", "landing", "negocio", "tienda", "empresa"],
      sistema: ["sistema", "administrativ", "formulario", "registro", "panel", "plataforma", "intranet", "control"],
      contenido: ["redes", "facebook", "instagram", "tiktok", "fotos", "fotograf", "foto=", "video", "diseno", "logo", "identidad"],
    },

    palabrasNecesidad: [
      { claves: ["turis"], opciones: ["Turismo"] },
      { claves: ["tramite"], opciones: ["Trámites"] },
      { claves: ["formulario", "registro"], opciones: ["Formularios", "Formularios y registros", "Formularios de contacto"] },
      { claves: ["galeria", "album"], opciones: ["Galería"] },
      { claves: ["transparencia", "informacion publica"], opciones: ["Información pública"] },
      { claves: ["servicios"], opciones: ["Mostrar servicios"] },
      { claves: ["acceso", "seguridad", "proteger", "proteccion"], opciones: ["Protección y control de acceso", "Accesos por usuario"] },
      { claves: ["redes", "facebook", "instagram"], opciones: ["Redes sociales"] },
      { claves: ["fotos", "fotograf", "foto="], opciones: ["Fotografía", "Galería"] },
      { claves: ["video"], opciones: ["Video"] },
      { claves: ["logo", "diseno", "identidad"], opciones: ["Diseño gráfico"] },
    ],

    // Lo que se escribe en los pasos que solo tienen opciones. Cada entrada es
    // [índice de la opción, expresión]; se prueba contra el texto normalizado.
    sinonimos: {
      contacto: [
        [1, /\b(e-?mail|mail|correo)\b|@/],
        [0, /whats|wasap|guasap|wpp/],
      ],
      ambito: [
        [0, /municip|ayuntamiento|alcald|gobierno|cabildo/],
        [1, /negocio|empresa|tienda|local|comercio|panader|restaur|hotel|consultorio|despacho/],
        [2, /personal|propio|\bmio\b|para mi\b/],
        [3, /asociaci|escuela|organizaci|fundaci|iglesia|club|colegio|universidad/],
      ],
    },

    // Respuestas escritas que equivalen a no dar el dato opcional.
    noDecirlo: /^(no|nop|ninguno|prefiero no( decirlo)?|no quiero( decirlo)?|prefiero no decirlo|lo comparto despues|despues)\.?$/,
    /** Quita «Me llamo», «Soy» o «Mi nombre es» al principio del nombre. */
    prefijoNombre: /^(hola[,.!]?\s*)?(me llamo|mi nombre es|soy)\s+/i,
    /** Entradas de cortesía que se quitan al repetir una pregunta. */
    cortesia: /^(Perfecto|Entendido|Sin problema, lo vemos juntos|Te sugiero empezar por [^.]+|Gracias, [^.]+)\. /,
    /** Respuestas vagas que no se repiten en el resumen. */
    vago: /^(no s[eé]|ni idea|no estoy segur[oa]|hola|buen[oa]s?( dias| tardes| noches)?)\W*$/i,

    // Expresiones del panel que dependen de la lengua.
    pidePersona:
      /hablar con (una |un |alguna |alg[uú]n )?(persona|alguien|asesor(a)?|humano|ejecutiv[oa])|persona del equipo|atenci[oó]n humana|asesor(a)? humano/i,
    pideLlamada: /llam|marc|telef|celular/i,
    mencionaCanal: /whats|wasap|wpp|correo|mail/i,

    comillas: ["«", "»"],

    pasos: {
      tipo: {
        titulo: "Proyecto",
        entrada: "Escribe lo que buscas…",
        pregunta: (r) =>
          r.tiposSugeridos
            ? "Perfecto. ¿Lo que buscas es un portal municipal o un sistema administrativo?"
            : "¿Buscas un portal municipal, una página web o algún sistema digital?",
      },
      ambito: {
        titulo: "Es para",
        pregunta: (r) =>
          r.idea
            ? "Entendido. ¿Es para un municipio, un negocio o un proyecto personal?"
            : "Sin problema, lo vemos juntos. ¿Es para un municipio, un negocio o un proyecto personal?",
      },
      organizacion: {
        titulo: "Municipio u organización",
        entrada: "Nombre del municipio u organización",
        pregunta: (r) => {
          const intro = r.ambito ? `Te sugiero empezar por ${r.tipoId === "portal" ? "un portal municipal" : "una página web"}. ` : "Perfecto. ";
          if (r.tipoId === "portal") return `${intro}¿Para qué municipio sería?`;
          if (r.ambito === "Un proyecto personal") return `${intro}¿Cómo se llama tu proyecto?`;
          return `${intro}¿Para qué municipio u organización sería?`;
        },
      },
      necesidad: {
        titulo: "Lo principal",
        entrada: "Cuéntame en pocas palabras…",
        pregunta: (r) =>
          r.tipoId === "portal"
            ? "¿Qué es lo principal que necesitas: información pública, turismo, trámites, formularios, galería o algo más?"
            : "¿Qué es lo principal que necesitas?",
      },
      nombre: {
        titulo: "Nombre",
        entrada: "Tu nombre",
        pregunta: () => "Para que el equipo sepa con quién habla, ¿cómo te llamas?",
      },
      contacto: {
        titulo: "Contacto",
        pregunta: (r) => (r.nombre ? `Gracias, ${r.nombre}. ` : "") + "¿Cómo prefieres que te contactemos?",
      },
      correo: {
        titulo: "Correo",
        entrada: "tu@correo.com",
        etiqueta: "Tu correo",
        reserva: "Lo comparto después",
        pregunta: () => "¿A qué correo te escribimos? Si prefieres, lo compartes después.",
      },
    },

    textos: {
      bienvenida: "¡Hola! Soy el asistente de Northa Digital. ¿Buscas un portal municipal, una página web o algún sistema digital?",
      aviso: "Tu mensaje llega al equipo de Northa cuando lo envías por WhatsApp.",
      cierre: "Con gusto te ayudo a definirlo. ¿Quieres continuar por WhatsApp con el equipo de Northa Digital?",
      persona:
        "Claro. Puedes escribirle directo al equipo por WhatsApp o mandar un correo. El mensaje se abre listo para que tú lo envíes.",
      dudas: "Dime qué te gustaría saber, o elige una pregunta.",
      mensajePersona: "Me gustaría hablar con una persona del equipo.",
      correoInvalido: "Ese correo no parece completo. ¿Me lo escribes de nuevo? También puedes compartirlo después.",
      sinLlamadas: "Por ahora atendemos por WhatsApp y correo, no por llamada. ¿Cuál prefieres?",
    },

    // Cuerpo del mensaje de WhatsApp (sin el saludo, que añade site.js).
    mensaje: {
      busco: (x) => `Busco: ${x}`,
      esPara: (x) => `Es para: ${x.toLowerCase()}`,
      organizacion: (x) => `Municipio u organización: ${x}`,
      principal: (x) => `Lo principal: ${x}`,
      enMisPalabras: (x) => `En mis palabras: ${x}`,
      contacto: (forma, correo) => `Prefiero que me contacten por ${forma}${correo ? ` (${correo})` : ""}.`,
      formaCorreo: "correo",
      formaWhatsapp: "WhatsApp",
      cierre: "¿Me pueden orientar?",
    },
  },

  // ------------------------------------------------------------------ en
  en: {
    TIPO_NO_SE: "I'm not sure",
    OPCION_OTRA: "Something else",
    OPCION_RESERVA: "I'd rather not say",

    tipos: [
      { id: "portal", label: "Municipal portal" },
      { id: "web", label: "Website" },
      { id: "sistema", label: "Administrative system" },
      { id: "contenido", label: "Content and design" },
    ],

    ambitos: ["A municipality", "A business", "A personal project", "Another organization"],

    necesidades: {
      portal: ["Public information", "Tourism", "Procedures", "Forms", "Gallery"],
      web: ["Present my business or project", "Show services", "Gallery", "Contact forms"],
      sistema: ["Organize information", "Forms and records", "User-based access", "Protection and access control"],
      contenido: ["Social media", "Photography", "Video", "Graphic design"],
    },

    formasContacto: ["WhatsApp", "Email"],

    palabrasTipo: {
      portal: ["municipal", "municipality", "city hall", "town hall", "council", "portal", "government", "transparency", "touris"],
      web: ["website", "web page", "webpage", "site", "web", "landing", "business", "shop", "store", "company"],
      sistema: ["system", "admin", "forms=", "form=", "record", "panel", "platform", "intranet", "control", "dashboard"],
      contenido: ["social", "facebook", "instagram", "tiktok", "photo=", "photos=", "photograph", "video", "design", "logo=", "logos=", "identity", "brand"],
    },

    palabrasNecesidad: [
      { claves: ["touris"], opciones: ["Tourism"] },
      { claves: ["procedure", "paperwork", "permit"], opciones: ["Procedures"] },
      { claves: ["forms=", "form=", "record"], opciones: ["Forms", "Forms and records", "Contact forms"] },
      { claves: ["gallery", "album"], opciones: ["Gallery"] },
      { claves: ["transparency", "public information"], opciones: ["Public information"] },
      { claves: ["services"], opciones: ["Show services"] },
      { claves: ["access", "security", "protect"], opciones: ["Protection and access control", "User-based access"] },
      { claves: ["social", "facebook", "instagram"], opciones: ["Social media"] },
      { claves: ["photos=", "photo=", "photograph"], opciones: ["Photography", "Gallery"] },
      { claves: ["video"], opciones: ["Video"] },
      { claves: ["logo=", "logos=", "design", "identity"], opciones: ["Graphic design"] },
    ],

    sinonimos: {
      contacto: [
        [1, /\b(e-?mail|mail)\b|@/],
        [0, /whats|wpp/],
      ],
      ambito: [
        [0, /municip|city hall|town hall|council|government|county|village|\btown\b/],
        [1, /business|company|shop|store|local|commerce|bakery|restaurant|hotel|clinic|office|firm|agency/],
        [2, /personal|\bmy own\b|\bmine\b|for me\b|myself|hobby/],
        [3, /association|school|organi[sz]ation|foundation|church|club|college|universit|nonprofit|\bngo\b/],
      ],
    },

    noDecirlo:
      /^(no|nope|none|prefer not to say|i'?d rather not( say)?|rather not( say)?|i don'?t want to say|i'?ll share (it )?later|share (it )?later|later)\.?$/,
    prefijoNombre: /^(?:(?:hi|hello|hey)[,.!]?\s*)?(?:my name is|i'?m|i am|it'?s|this is|call me)\s+/i,
    cortesia:
      /^(Perfect|Understood|No problem, we'll figure it out together|I suggest starting with [^.]+|Thanks, [^.]+)\. /,
    vago: /^(i don'?t know|no idea|not sure|i'?m not sure|hi|hello|hey|good (morning|afternoon|evening))\W*$/i,

    pidePersona:
      /\b(talk|speak|chat)(ing)? (to|with) (a |an |some |the )?(real |live )?(person|human|someone|somebody|advisor|agent|representative|team( member)?)|real person|live (agent|person)|human (agent|support|help)|person (from|on) the team/i,
    pideLlamada: /\bcall|phone|dial|\bcell\b|mobile/i,
    mencionaCanal: /whats|wpp|e-?mail|\bmail\b/i,

    comillas: ["“", "”"],

    pasos: {
      tipo: {
        titulo: "Project",
        entrada: "Type what you're looking for…",
        pregunta: (r) =>
          r.tiposSugeridos
            ? "Perfect. Are you looking for a municipal portal or an administrative system?"
            : "Are you looking for a municipal portal, a website or some digital system?",
      },
      ambito: {
        titulo: "It's for",
        pregunta: (r) =>
          r.idea
            ? "Understood. Is it for a municipality, a business or a personal project?"
            : "No problem, we'll figure it out together. Is it for a municipality, a business or a personal project?",
      },
      organizacion: {
        titulo: "Municipality or organization",
        entrada: "Name of the municipality or organization",
        pregunta: (r) => {
          const intro = r.ambito ? `I suggest starting with ${r.tipoId === "portal" ? "a municipal portal" : "a website"}. ` : "Perfect. ";
          if (r.tipoId === "portal") return `${intro}Which municipality would it be for?`;
          if (r.ambito === "A personal project") return `${intro}What's your project called?`;
          return `${intro}Which municipality or organization would it be for?`;
        },
      },
      necesidad: {
        titulo: "Main need",
        entrada: "Tell me briefly…",
        pregunta: (r) =>
          r.tipoId === "portal"
            ? "What do you mainly need: public information, tourism, procedures, forms, a gallery or something else?"
            : "What do you mainly need?",
      },
      nombre: {
        titulo: "Name",
        entrada: "Your name",
        pregunta: () => "So the team knows who they're talking to, what's your name?",
      },
      contacto: {
        titulo: "Contact",
        pregunta: (r) => (r.nombre ? `Thanks, ${r.nombre}. ` : "") + "How would you like us to contact you?",
      },
      correo: {
        titulo: "Email",
        entrada: "you@email.com",
        etiqueta: "Your email",
        reserva: "I'll share it later",
        pregunta: () => "Which email should we write to? If you prefer, you can share it later.",
      },
    },

    textos: {
      bienvenida: "Hi! I'm Northa Digital's assistant. Are you looking for a municipal portal, a website or some digital system?",
      aviso: "Your message reaches the Northa team when you send it through WhatsApp.",
      cierre: "Happy to help you define it. Would you like to continue on WhatsApp with the Northa Digital team?",
      persona:
        "Of course. You can message the team directly on WhatsApp or send an email. The message opens ready for you to send.",
      dudas: "Tell me what you'd like to know, or pick a question.",
      mensajePersona: "I'd like to talk to someone on the team.",
      correoInvalido: "That email doesn't look complete. Could you type it again? You can also share it later.",
      sinLlamadas: "For now we're available on WhatsApp and email, not by phone. Which do you prefer?",
    },

    mensaje: {
      busco: (x) => `Looking for: ${x}`,
      esPara: (x) => `It's for: ${x.toLowerCase()}`,
      organizacion: (x) => `Municipality or organization: ${x}`,
      principal: (x) => `Main need: ${x}`,
      enMisPalabras: (x) => `In my own words: ${x}`,
      contacto: (forma, correo) => `I'd prefer to be contacted by ${forma}${correo ? ` (${correo})` : ""}.`,
      formaCorreo: "email",
      formaWhatsapp: "WhatsApp",
      cierre: "Could you point me in the right direction?",
    },
  },
};

// ---------- Texto libre (no depende del idioma) ----------

export const normalizar = (t = "") =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Una clave coincide con una palabra del texto que empieza igual
 * ("administrativ" → administrativo), o con la palabra exacta si termina en
 * "=" ("foto=" no coincide con "fotocopias"), o como frase si lleva espacio.
 * Así «tienda» no coincide dentro de «atienda» ni «logo» en «odontólogo».
 */
function hay(texto, clave) {
  const t = normalizar(texto);
  if (clave.includes(" ")) return ` ${t.replace(/[^a-z0-9]+/g, " ")} `.includes(` ${clave} `);
  const palabras = t.split(/[^a-z0-9]+/);
  return clave.endsWith("=") ? palabras.includes(clave.slice(0, -1)) : palabras.some((p) => p.startsWith(clave));
}

/** Formato mínimo de correo: algo@algo.algo, sin espacios. */
export const correoValido = (t) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim());

// ---------- La conversación de un idioma ----------

function crear(P) {
  const { TIPO_NO_SE, OPCION_OTRA, OPCION_RESERVA, tipos, ambitos, necesidades, formasContacto } = P;
  const CORREO = formasContacto[1];
  const [AMBITO_MUNICIPIO] = ambitos;

  const tipoPorId = (id) => tipos.find((t) => t.id === id) ?? null;
  const tipoPorLabel = (label) => tipos.find((t) => t.label === label) ?? null;
  const nec = necesidades;

  // Entradas desde el sitio (menú de servicios, banda, sección de seguridad):
  // cada servicio real se traduce a un punto de partida de la conversación.
  const PUNTOS_DE_PARTIDA = {
    "portales-sistemas": { tiposSugeridos: ["portal", "sistema"] },
    "desarrollo-web": { tipoId: "web" },
    "redes-sociales": { tipoId: "contenido", necesidad: nec.contenido[0] },
    fotografia: { tipoId: "contenido", necesidad: nec.contenido[1] },
    video: { tipoId: "contenido", necesidad: nec.contenido[2] },
    "diseno-grafico": { tipoId: "contenido", necesidad: nec.contenido[3] },
    seguridad: { tipoId: "sistema", necesidad: nec.sistema[3] },
  };

  /** Respuestas iniciales cuando la conversación empieza desde un servicio. */
  function respuestasDesde(servicioId) {
    const p = PUNTOS_DE_PARTIDA[servicioId];
    if (!p) return {};
    const r = {};
    if (p.tiposSugeridos) r.tiposSugeridos = p.tiposSugeridos;
    if (p.tipoId) {
      r.tipoId = p.tipoId;
      r.tipo = tipoPorId(p.tipoId).label;
    }
    if (p.necesidad) r.necesidad = p.necesidad;
    // Campos que no respondió el visitante: «Atrás» no vuelve a ellos.
    r.precargados = ["tipo", "necesidad"].filter((c) => c in r);
    return r;
  }

  /** Tipo de proyecto que se reconoce en un texto, o null. */
  function tipoDesdeTexto(texto) {
    let mejor = null;
    let puntos = 0;
    for (const [id, claves] of Object.entries(P.palabrasTipo)) {
      const n = claves.filter((c) => hay(texto, c)).length;
      if (n > puntos) {
        mejor = id;
        puntos = n;
      }
    }
    return mejor;
  }

  /** Necesidad de la lista del tipo que se reconoce en un texto, o null. */
  function necesidadDesdeTexto(texto, tipoId) {
    const lista = necesidades[tipoId] ?? [];
    for (const { claves, opciones } of P.palabrasNecesidad) {
      if (!claves.some((c) => hay(texto, c))) continue;
      const hallada = opciones.find((o) => lista.includes(o));
      if (hallada) return hallada;
    }
    return null;
  }

  /** Opción de un paso sin texto que corresponde a lo escrito, o null. */
  function opcionDesdeTexto(campo, texto) {
    const t = normalizar(texto);
    const opciones = campo === "contacto" ? formasContacto : campo === "ambito" ? ambitos : [];
    const hallada = (P.sinonimos[campo] ?? []).find(([, re]) => re.test(t));
    return hallada ? opciones[hallada[0]] : null;
  }

  // ---------- Pasos ----------

  /**
   * Pasos de la conversación, en orden. `campo` es la clave en las respuestas.
   *  - pregunta(r): texto del asistente.
   *  - opciones(r): etiquetas para elegir (puede ser vacío).
   *  - cuando(r): el paso solo aplica si devuelve true.
   *  - texto: acepta una respuesta escrita; `entrada` es el texto de ayuda.
   *  - reserva: etiqueta del botón para no responder (el dato es opcional).
   *  - otra: muestra «Algo más» para escribirlo con sus palabras.
   */
  const T = P.pasos;
  const pasos = [
    {
      campo: "tipo",
      ...T.tipo,
      opciones: (r) => [
        ...(r.tiposSugeridos ? r.tiposSugeridos.map((id) => tipoPorId(id).label) : tipos.map((t) => t.label)),
        TIPO_NO_SE,
      ],
      texto: true,
    },
    {
      campo: "ambito",
      ...T.ambito,
      cuando: (r) => !!r.noSabe,
      opciones: () => ambitos,
    },
    {
      campo: "organizacion",
      ...T.organizacion,
      opciones: () => [],
      texto: true,
      reserva: OPCION_RESERVA,
    },
    {
      campo: "necesidad",
      ...T.necesidad,
      opciones: (r) => necesidades[r.tipoId] ?? [],
      texto: true,
      otra: true,
    },
    {
      campo: "nombre",
      ...T.nombre,
      opciones: () => [],
      texto: true,
      reserva: OPCION_RESERVA,
    },
    {
      campo: "contacto",
      ...T.contacto,
      opciones: () => formasContacto,
    },
    {
      campo: "correo",
      ...T.correo,
      cuando: (r) => r.contacto === CORREO,
      opciones: () => [],
      texto: true,
    },
  ];

  /** El paso aplica con estas respuestas. */
  const aplica = (p, r) => !p.cuando || p.cuando(r);

  /** Índice del primer paso que aplica y aún no tiene respuesta, desde `desde`. */
  function siguientePaso(r, desde = 0) {
    for (let i = desde; i < pasos.length; i++) {
      const p = pasos[i];
      if (aplica(p, r) && !(p.campo in r)) return i;
    }
    return pasos.length;
  }

  /** Pasos que aplican ahora (para el contador «2 de 5»). */
  const pasosVisibles = (r) => pasos.filter((p) => aplica(p, r));

  /** La conversación tiene lo necesario para preparar el mensaje. */
  const consultaCompleta = (r) => siguientePaso(r) >= pasos.length && !!r?.tipo;

  const limpiarNombre = (v) => v.replace(P.prefijoNombre, "").trim() || v;

  /** Marca o desmarca un campo como precargado (no lo respondió el visitante). */
  function precargar(n, campo, si) {
    const lista = (n.precargados ?? []).filter((c) => c !== campo);
    n.precargados = si ? [...lista, campo] : lista;
  }

  /**
   * Guarda la respuesta de un paso y devuelve las respuestas nuevas. Aplica las
   * reglas que dependen del texto: tipo reconocido, ámbito que sugiere un tipo,
   * necesidad reconocida, nombre sin «Me llamo», «Prefiero no decirlo» (null).
   */
  function aplicarRespuesta(r, campo, valor) {
    const n = { ...r };
    precargar(n, campo, false);
    if (campo === "tipo") {
      delete n.tiposSugeridos;
      const t = tipoPorLabel(valor);
      if (valor === TIPO_NO_SE) {
        n.noSabe = true;
        n.tipo = TIPO_NO_SE;
        delete n.tipoId;
      } else if (t) {
        n.tipo = t.label;
        n.tipoId = t.id;
        delete n.noSabe;
        delete n.ambito;
      } else {
        // Texto libre: se intenta reconocer el tipo; si no, se pregunta el ámbito.
        const id = tipoDesdeTexto(valor);
        n.idea = valor;
        if (id) {
          n.tipo = tipoPorId(id).label;
          n.tipoId = id;
          delete n.noSabe;
          const necesidad = necesidadDesdeTexto(valor, id);
          if (necesidad && !("necesidad" in r)) {
            n.necesidad = necesidad;
            precargar(n, "necesidad", true);
          }
        } else {
          n.noSabe = true;
          n.tipo = TIPO_NO_SE;
          delete n.tipoId;
        }
      }
      // Si cambió el tipo, la necesidad elegida puede no aplicar.
      if (r.tipoId !== n.tipoId && "necesidad" in n && !(necesidades[n.tipoId] ?? []).includes(n.necesidad)) {
        delete n.necesidad;
        delete n.detalle;
      }
      return n;
    }
    if (campo === "ambito") {
      n.ambito = valor;
      n.tipoId = valor === AMBITO_MUNICIPIO ? "portal" : "web";
      n.tipo = tipoPorId(n.tipoId).label;
      if ("necesidad" in n && !necesidades[n.tipoId].includes(n.necesidad)) {
        delete n.necesidad;
        delete n.detalle;
      }
      if (n.idea) {
        const necesidad = necesidadDesdeTexto(n.idea, n.tipoId);
        if (necesidad && !("necesidad" in n)) {
          n.necesidad = necesidad;
          precargar(n, "necesidad", true);
        }
      }
      return n;
    }
    if (campo === "necesidad") {
      delete n.detalle;
      if (valor && !(necesidades[n.tipoId] ?? []).includes(valor)) {
        // Escrita con sus palabras: se reconoce la categoría y se conserva el texto.
        const reconocida = necesidadDesdeTexto(valor, n.tipoId);
        n.necesidad = reconocida ?? valor;
        if (reconocida) n.detalle = valor;
        return n;
      }
      n.necesidad = valor;
      return n;
    }
    if (campo === "contacto" && valor !== CORREO) delete n.correo;
    const sinDato = valor == null || valor === OPCION_RESERVA || P.noDecirlo.test(normalizar(String(valor)));
    n[campo] = sinDato ? null : campo === "nombre" ? limpiarNombre(valor) : valor;
    return n;
  }

  /** Quita la respuesta de un campo (y lo que depende de él) para volver a preguntarlo. */
  function quitarRespuesta(r, campo) {
    const n = { ...r };
    delete n[campo];
    precargar(n, campo, false);
    if (campo === "tipo") {
      delete n.tipoId;
      delete n.noSabe;
      delete n.ambito;
      delete n.idea;
    }
    if (campo === "ambito") delete n.tipoId;
    if (campo === "necesidad") delete n.detalle;
    if (campo === "contacto") delete n.correo;
    return n;
  }

  /**
   * La pregunta de un paso sin las entradas de cortesía («Perfecto.», «Te
   * sugiero…», «Gracias, Ana.»): para repetirla tras «Atrás», «Cambiar» o una
   * duda sin que suene mecánica.
   */
  const preguntaSola = (i, r) => pasos[i].pregunta(r).replace(P.cortesia, "");

  // ---------- Textos ----------

  const consulta = P.textos;

  /** Lo que el visitante escribió con sus palabras, sin repetir lo que ya dice el resumen. */
  function enSusPalabras(r) {
    const repetido = (t) => [r.tipo, r.necesidad].some((x) => x && normalizar(x) === normalizar(t));
    const vago = (t) => P.vago.test(t.trim());
    return [r.idea, r.detalle].filter((t, i, a) => t && !repetido(t) && !vago(t) && a.indexOf(t) === i);
  }

  /** Líneas del resumen, solo con lo que se respondió. */
  function lineasResumen(r) {
    const [abre, cierra] = P.comillas;
    const titulo = (campo) => T[campo].titulo;
    const lineas = [];
    if (r.tipo && r.tipo !== TIPO_NO_SE) lineas.push({ campo: "tipo", titulo: titulo("tipo"), texto: r.tipo });
    if (r.ambito) lineas.push({ campo: "ambito", titulo: titulo("ambito"), texto: r.ambito });
    if (r.organizacion) lineas.push({ campo: "organizacion", titulo: titulo("organizacion"), texto: r.organizacion });
    if (r.necesidad) {
      lineas.push({
        campo: "necesidad",
        titulo: titulo("necesidad"),
        texto: r.detalle ? `${r.necesidad}: ${abre}${r.detalle}${cierra}` : r.necesidad,
      });
    }
    if (r.nombre) lineas.push({ campo: "nombre", titulo: titulo("nombre"), texto: r.nombre });
    if (r.contacto) {
      lineas.push({ campo: "contacto", titulo: titulo("contacto"), texto: r.correo ? `${r.contacto} (${r.correo})` : r.contacto });
    }
    return lineas;
  }

  /** Cuerpo del mensaje de WhatsApp (sin el saludo, que añade site.js). */
  function mensajeConsulta(r) {
    const m = P.mensaje;
    const lineas = [];
    if (r.tipo && r.tipo !== TIPO_NO_SE) lineas.push(m.busco(r.tipo));
    if (r.ambito) lineas.push(m.esPara(r.ambito));
    if (r.organizacion) lineas.push(m.organizacion(r.organizacion));
    if (r.necesidad) lineas.push(m.principal(r.necesidad));
    for (const t of enSusPalabras(r)) lineas.push(m.enMisPalabras(t));
    if (r.contacto) {
      lineas.push(m.contacto(r.contacto === CORREO ? m.formaCorreo : m.formaWhatsapp, r.correo));
    }
    return [...lineas, "", m.cierre].join("\n");
  }

  return {
    TIPO_NO_SE,
    OPCION_OTRA,
    OPCION_RESERVA,
    tipos,
    ambitos,
    necesidades,
    formasContacto,
    tipoPorId,
    respuestasDesde,
    tipoDesdeTexto,
    necesidadDesdeTexto,
    opcionDesdeTexto,
    correoValido,
    pasos,
    aplica,
    siguientePaso,
    pasosVisibles,
    consultaCompleta,
    aplicarRespuesta,
    quitarRespuesta,
    preguntaSola,
    consulta,
    lineasResumen,
    mensajeConsulta,
    // Expresiones del panel que dependen de la lengua.
    pidePersona: P.pidePersona,
    pideLlamada: P.pideLlamada,
    mencionaCanal: P.mencionaCanal,
  };
}

export const getConsulta = porIdioma((locale) => crear(PACKS[locale] ?? PACKS.es));
