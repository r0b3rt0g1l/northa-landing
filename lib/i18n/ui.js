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
    ayuda: "Elige un servicio y Nora te guía en tu consulta.",
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
    chatbots: {
      eyebrow: "Nuevo",
      como: "¿Cómo funciona?",
      beneficios: "Beneficios",
      consultar: "Consultar sobre chatbots",
    },
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
    asistente: "Hablar con Nora",
  },

  whatsapp: {
    boton: "Escríbenos por WhatsApp",
    porWhatsapp: " por WhatsApp",
    pestana: " (se abre en una pestaña nueva)",
    // Mensaje prellenado de todo el sitio.
    mensaje: "Hola, vi su página y me interesa un servicio digital.",
    mensajeNombre: (nombre) => `Hola, soy ${nombre}. Vi su página y me interesa un servicio digital.`,
  },

  botonAsistente: "Hablar con Nora",

  notFound: {
    titulo: "Página no encontrada",
    texto: "La página que buscas no existe o cambió de lugar.",
    volver: "Volver al inicio",
  },

  lanzador: { abrir: "Hablar con Nora, la asistente del sitio", etiqueta: "Nora" },

  panel: {
    nombre: "Nora",
    descripcion: "Asistente virtual de Northa Digital",
    cargando: "Abriendo el chat con Nora…",
    cerrar: "Cerrar el chat",
    reiniciar: "Empezar de nuevo",
    respaldoError: "No pudimos cargar el chat. Escríbenos y te respondemos directamente.",
    escribirWhatsapp: "Escribir por WhatsApp",
    conversacion: "Conversación con Nora",
    tu: "Tú: ",
    nora: "Nora: ",
    escribiendo: "Nora está escribiendo…",
    campo: "Mensaje para Nora",
    placeholder: "Escribe un mensaje…",
    enviar: "Enviar mensaje",
    aviso: "Respuestas automáticas. Tus datos solo llegan al equipo si tú envías el mensaje por WhatsApp.",
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
    ayuda: "Pick a service and Nora will guide your inquiry.",
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
    chatbots: {
      eyebrow: "New",
      como: "How does it work?",
      beneficios: "Benefits",
      consultar: "Ask about chatbots",
    },
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
    asistente: "Chat with Nora",
  },

  whatsapp: {
    boton: "Message us on WhatsApp",
    porWhatsapp: " on WhatsApp",
    pestana: " (opens in a new tab)",
    mensaje: "Hi, I saw your website and I'm interested in a digital service.",
    mensajeNombre: (nombre) => `Hi, I'm ${nombre}. I saw your website and I'm interested in a digital service.`,
  },

  botonAsistente: "Chat with Nora",

  notFound: {
    titulo: "Page not found",
    texto: "The page you're looking for doesn't exist or has moved.",
    volver: "Back to home",
  },

  lanzador: { abrir: "Chat with Nora, the site assistant", etiqueta: "Nora" },

  panel: {
    nombre: "Nora",
    descripcion: "Northa Digital's virtual assistant",
    cargando: "Opening the chat with Nora…",
    cerrar: "Close the chat",
    reiniciar: "Start over",
    respaldoError: "We couldn't load the chat. Write to us and we'll reply directly.",
    escribirWhatsapp: "Message us on WhatsApp",
    conversacion: "Conversation with Nora",
    tu: "You: ",
    nora: "Nora: ",
    escribiendo: "Nora is typing…",
    campo: "Message for Nora",
    placeholder: "Type a message…",
    enviar: "Send message",
    aviso: "Automatic answers. Your details only reach the team if you send the message on WhatsApp.",
  },
};

const diccionarios = { es, en };

export const getUi = (locale) => diccionarios[locale] ?? diccionarios[defaultLocale];
