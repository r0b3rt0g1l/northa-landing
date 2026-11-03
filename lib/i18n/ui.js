// Textos de la interfaz en cada idioma. El contenido largo (servicios,
// portafolio, asistente) vive en lib/content/*; aquí están las etiquetas,
// los avisos y los nombres accesibles de los componentes.
//
// Regla: cada clave existe en «es» y en «en». Si se agrega una, se agrega en
// las dos (getUi cae al español si falta alguna, pero no debe pasar).

import { defaultLocale } from "./config";

const es = {
  skip: "Saltar al contenido principal",
  logoInicio: "Northa Digital, inicio",

  // Selector de idioma: describe el enlace al OTRO idioma.
  idioma: { corto: "EN", nombre: "English", aria: "Switch to English" },

  nav: {
    aria: "Navegación principal",
    servicios: "Servicios",
    verSeccion: "Ver la sección de servicios",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
  },

  menuServicios: {
    aria: "Servicios",
    conocerMas: "Conocer más",
    consultarSeguridad: "Consultar sobre seguridad",
    ayuda: "Elige un servicio y el asistente te guía en tu consulta.",
    verTodo: "Ver todo",
  },

  hero: { explorar: "Explorar" },

  servicios: {
    eyebrow: "Servicios",
    titulo: "Lo que construimos",
    lead: "Portales municipales, sitios web y soluciones digitales con diseño limpio y tecnología bien hecha.",
    banda: "Servicios de Northa Digital",
    pausar: "Pausar el movimiento de los servicios",
    reanudar: "Reanudar el movimiento de los servicios",
    sello: "Sello: creado por Northa Digital",
    selloTexto: "CREADO POR NORTHA DIGITAL ✦ DISEÑO · SISTEMAS · CONTENIDO ✦",
  },

  portafolio: {
    eyebrow: "Portafolio",
    titulo: "Trabajo seleccionado",
    descripcion: "Portales municipales en línea, diseñados y construidos por Northa Digital.",
    marco: "Portales municipales",
    hechosPor: "Hechos por Northa Digital",
    publicados: (n) => `${n} publicados`,
    abre: (nombre) => ` (abre el portal de ${nombre} en una pestaña nueva)`,
  },

  seguridad: {
    eyebrow: "Seguridad",
    capturasReales: "Capturas reales",
    pasosEtiqueta: "Pasos del acceso al panel. Desliza para ver los tres.",
    paso: (n) => `Paso ${n}`,
    demo: {
      aria: "Ilustración: un equipo se conecta por un túnel VPN cifrado, inicia sesión de forma segura y llega a un panel administrativo protegido y monitoreado.",
      panel: "Panel administrativo",
      protegido: "Protegido",
      login: "Login seguro",
      loginSub: "Acceso administrativo",
      vpn: "VPN",
      vpnSub: "Conexión cifrada",
      etiqueta: "Demostración visual",
    },
  },

  footer: {
    aria: "Enlaces del pie de página",
    contacto: "Contacto",
    whatsapp: "Escríbenos por WhatsApp",
    asistente: "Abrir el asistente",
  },

  whatsapp: {
    boton: "Escríbenos por WhatsApp",
    porWhatsapp: " por WhatsApp",
    pestana: " (se abre en una pestaña nueva)",
    // Mensaje prellenado de todo el sitio.
    mensaje: "Hola, vi su página y me interesa un servicio digital.",
    mensajeNombre: (nombre) => `Hola, soy ${nombre}. Vi su página y me interesa un servicio digital.`,
  },

  botonAsistente: "Hablar con el asistente",

  notFound: {
    titulo: "Página no encontrada",
    texto: "La página que buscas no existe o cambió de lugar.",
    volver: "Volver al inicio",
  },

  lanzador: { abrir: "Abrir asistente del sitio", etiqueta: "Asistente" },

  panel: {
    nombre: "Asistente de Northa",
    descripcion: "Respuestas automáticas",
    cargando: "Abriendo el asistente…",
    cerrar: "Cerrar asistente",
    reiniciar: "Empezar de nuevo",
    respaldoError: "No pudimos cargar el asistente. Escríbenos y te respondemos directamente.",
    escribirWhatsapp: "Escribir por WhatsApp",
    conversacion: "Conversación",
    tu: "Tú: ",
    asistente: "Asistente: ",
    preguntasFrecuentes: "Preguntas frecuentes",
    opciones: "Opciones",
    pasoDe: (n, total, pregunta) => `Paso ${n} de ${total}. ${pregunta}`,
    atras: "Atrás",
    cambiar: "Cambiar",
    cambiarAria: (titulo) => `Cambiar ${titulo}`,
    cambiarEco: (titulo) => `Cambiar: ${titulo}`,
    continuarWhatsapp: "Continuar por WhatsApp",
    continuarAviso: " (abre WhatsApp; tú decides si envías el mensaje)",
    notaWhatsapp: "Se abre WhatsApp con el mensaje listo. Nada se envía hasta que tú lo mandes.",
    verMensaje: "Ver el mensaje",
    hablarPersona: "Hablar con una persona",
    ecoPersona: "Quiero hablar con una persona",
    tengoDuda: "Tengo una duda",
    volverConsulta: "Volver a mi consulta",
    seguirConsulta: "Seguir con mi consulta",
    mejorProyecto: "Mejor cuéntame tu proyecto",
    placeholderRespuesta: "Escribe tu respuesta…",
    placeholderPregunta: "Escribe tu pregunta…",
    enviar: "Enviar",
    sigamos: "Sigamos. ",
    hablemosDe: (x) => `Hablemos de ${x}.`,
    hablemosDeTu: (x) => `Hablemos de tu ${x}.`,
    holaSoy: "¡Hola! Soy el asistente de Northa Digital.",
    hola: "¡Hola! ",
    eligeOpcion: "Elige una de las opciones de abajo o escríbela con otras palabras.",
    abrirWhatsappPregunta: "Abrir WhatsApp con mi pregunta",
    contarProyecto: "Contar mi proyecto",
    consultarEsto: "Consultar sobre esto",
    verTrabajo: "Ver trabajo",
    verServicios: "Ver servicios",
    verPortales: "Ver portales",
    enviarCorreo: "Enviar correo",
    pedirPropuesta: "Pedir propuesta por WhatsApp",
  },
};

const en = {
  skip: "Skip to main content",
  logoInicio: "Northa Digital, home",

  idioma: { corto: "ES", nombre: "Español", aria: "Cambiar a español" },

  nav: {
    aria: "Main navigation",
    servicios: "Services",
    verSeccion: "See the services section",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
  },

  menuServicios: {
    aria: "Services",
    conocerMas: "Learn more",
    consultarSeguridad: "Ask about security",
    ayuda: "Pick a service and the assistant will guide your inquiry.",
    verTodo: "See all",
  },

  hero: { explorar: "Explore" },

  servicios: {
    eyebrow: "Services",
    titulo: "What we build",
    lead: "Municipal portals, websites and digital solutions with clean design and well-built technology.",
    banda: "Northa Digital services",
    pausar: "Pause the services animation",
    reanudar: "Resume the services animation",
    sello: "Seal: created by Northa Digital",
    selloTexto: "CREATED BY NORTHA DIGITAL ✦ DESIGN · SYSTEMS · CONTENT ✦",
  },

  portafolio: {
    eyebrow: "Portfolio",
    titulo: "Selected work",
    descripcion: "Municipal portals online, designed and built by Northa Digital.",
    marco: "Municipal portals",
    hechosPor: "Built by Northa Digital",
    publicados: (n) => `${n} published`,
    abre: (nombre) => ` (opens the ${nombre} portal in a new tab)`,
  },

  seguridad: {
    eyebrow: "Security",
    capturasReales: "Real screenshots",
    pasosEtiqueta: "Steps to access the panel. Swipe to see all three.",
    paso: (n) => `Step ${n}`,
    demo: {
      aria: "Illustration: a computer connects through an encrypted VPN tunnel, signs in securely and reaches a protected, monitored admin panel.",
      panel: "Admin panel",
      protegido: "Protected",
      login: "Secure login",
      loginSub: "Admin access",
      vpn: "VPN",
      vpnSub: "Encrypted connection",
      etiqueta: "Visual demo",
    },
  },

  footer: {
    aria: "Footer links",
    contacto: "Contact",
    whatsapp: "Message us on WhatsApp",
    asistente: "Open the assistant",
  },

  whatsapp: {
    boton: "Message us on WhatsApp",
    porWhatsapp: " on WhatsApp",
    pestana: " (opens in a new tab)",
    mensaje: "Hi, I saw your website and I'm interested in a digital service.",
    mensajeNombre: (nombre) => `Hi, I'm ${nombre}. I saw your website and I'm interested in a digital service.`,
  },

  botonAsistente: "Talk to the assistant",

  notFound: {
    titulo: "Page not found",
    texto: "The page you're looking for doesn't exist or has moved.",
    volver: "Back to home",
  },

  lanzador: { abrir: "Open site assistant", etiqueta: "Assistant" },

  panel: {
    nombre: "Northa Assistant",
    descripcion: "Automatic answers",
    cargando: "Opening the assistant…",
    cerrar: "Close assistant",
    reiniciar: "Start over",
    respaldoError: "We couldn't load the assistant. Write to us and we'll reply directly.",
    escribirWhatsapp: "Message us on WhatsApp",
    conversacion: "Conversation",
    tu: "You: ",
    asistente: "Assistant: ",
    preguntasFrecuentes: "Frequently asked questions",
    opciones: "Options",
    pasoDe: (n, total, pregunta) => `Step ${n} of ${total}. ${pregunta}`,
    atras: "Back",
    cambiar: "Change",
    cambiarAria: (titulo) => `Change ${titulo}`,
    cambiarEco: (titulo) => `Change: ${titulo}`,
    continuarWhatsapp: "Continue on WhatsApp",
    continuarAviso: " (opens WhatsApp; you decide whether to send the message)",
    notaWhatsapp: "WhatsApp opens with the message ready. Nothing is sent until you send it.",
    verMensaje: "View the message",
    hablarPersona: "Talk to a person",
    ecoPersona: "I want to talk to a person",
    tengoDuda: "I have a question",
    volverConsulta: "Back to my inquiry",
    seguirConsulta: "Continue my inquiry",
    mejorProyecto: "Let's talk about my project instead",
    placeholderRespuesta: "Type your answer…",
    placeholderPregunta: "Type your question…",
    enviar: "Send",
    sigamos: "Let's continue. ",
    hablemosDe: (x) => `Let's talk about ${x}.`,
    hablemosDeTu: (x) => `Let's talk about your ${x}.`,
    holaSoy: "Hi! I'm Northa Digital's assistant.",
    hola: "Hi! ",
    eligeOpcion: "Pick one of the options below or put it in other words.",
    abrirWhatsappPregunta: "Open WhatsApp with my question",
    contarProyecto: "Tell us about my project",
    consultarEsto: "Ask about this",
    verTrabajo: "See our work",
    verServicios: "See services",
    verPortales: "See portals",
    enviarCorreo: "Send email",
    pedirPropuesta: "Request a proposal on WhatsApp",
  },
};

const diccionarios = { es, en };

export const getUi = (locale) => diccionarios[locale] ?? diccionarios[defaultLocale];
