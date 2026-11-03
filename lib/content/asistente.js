import { getServicios, getSeguridad } from "./servicios";
import { getProyectoDestacado } from "./proyectos";
import { site } from "../site";
import { localizar, porIdioma } from "@/lib/i18n/localizar";

// Nora, la asistente del sitio. Conversa solo con texto: sin botones, menús ni
// listas de servicios. Sus respuestas están escritas por el equipo (no es
// inteligencia artificial) y siguen estas reglas:
//  - Responde primero a lo que se pregunta, en 2 a 5 líneas, con tono cercano.
//  - Solo menciona un servicio si tiene que ver con la duda.
//  - Nunca inventa precios, descuentos, fechas, garantías, clientes ni resultados.
//  - Cuando hace falta el equipo (cotización, contratar, urgencias, hablar con
//    alguien), pide nombre, correo o teléfono y una breve descripción, y deja un
//    mensaje listo para WhatsApp (lib/nora.js).
//
// Cada tema:
//   id, peso (multiplica la coincidencia; en empates gana el orden),
//   claves { es, en }: palabras o frases sin acentos ni signos, en minúsculas.
//     Una clave con espacio es una frase; con «*» al final, un prefijo; si no,
//     la palabra exacta.
//   respuesta { es, en }: texto o función (contexto, entrada normalizada).
//     Los enlaces se escriben [texto](destino): «whatsapp:» abre el chat con el
//     equipo, «correo:» el correo y «#seccion» lleva a esa parte de la página.
//   deriva: la respuesta pide los datos para pasar el caso al equipo.
//   interes { es, en }: lo que el visitante busca, para el mensaje al equipo.

const temasBase = [
  // ---------- Quién es Nora ----------
  {
    id: "asistente",
    peso: 1.8,
    claves: {
      es: [
        "quien eres",
        "como te llamas",
        "con quien hablo",
        "eres un bot",
        "eres humano",
        "eres humana",
        "eres una persona",
        "eres real",
        "eres un chatbot",
        "eres una ia",
        "robot",
        "inteligencia artificial",
      ],
      en: [
        "who are you",
        "what s your name",
        "who am i talking to",
        "are you a bot",
        "are you human",
        "are you a person",
        "are you real",
        "are you a chatbot",
        "are you an ai",
        "robot",
        "artificial intelligence",
      ],
    },
    respuesta: {
      es: (c, e) =>
        /bot|humano|humana|persona|real|robot|ia\b|inteligencia/.test(e)
          ? "Soy Nora, la asistente virtual de Northa Digital. No soy una persona: respondo con información que preparó el equipo. Si prefieres hablar con alguien, con gusto te paso con ellos."
          : "Soy Nora, la asistente de Northa Digital. Estoy aquí para orientarte, resolver dudas y ayudarte a encontrar la mejor solución para tu proyecto.",
      en: (c, e) =>
        /bot|human|person|real|robot|\bai\b|intelligence/.test(e)
          ? "I'm Nora, Northa Digital's virtual assistant. I'm not a person: I answer with information the team prepared. If you'd rather talk to someone, I'm happy to put you in touch with them."
          : "I'm Nora, Northa Digital's assistant. I'm here to guide you, answer questions and help you find the best solution for your project.",
    },
  },

  // ---------- Quien no sabe qué necesita ----------
  {
    id: "no-se",
    peso: 1.7,
    claves: {
      es: [
        "no se que necesito",
        "no se que ocupo",
        "no se bien que necesito",
        "no estoy seguro",
        "no estoy segura",
        "no tengo idea",
        "ni idea",
        "no se por donde empezar",
      ],
      en: ["i don t know what i need", "not sure what i need", "no idea", "not sure", "don t know where to start"],
    },
    respuesta: {
      es: "No te preocupes, eso es muy común. Cuéntame qué tipo de negocio tienes y qué te gustaría que las personas puedan hacer en tu página; por ejemplo, conocer tus servicios, agendar, comprar o contactarte.",
      en: "Don't worry, that's very common. Tell me what kind of business you have and what you'd like people to be able to do on your site; for example, learn about your services, book, buy or contact you.",
    },
  },
  {
    id: "presencia",
    peso: 1.5,
    claves: {
      es: ["presencia en internet", "presencia digital", "presencia en linea", "estar en internet", "que me encuentren"],
      en: ["online presence", "presence online", "digital presence", "be on the internet", "people to find me"],
    },
    respuesta: {
      es: "Perfecto. Podemos empezar por algo sencillo: un sitio profesional que muestre claramente quién eres, qué ofreces y cómo pueden contactarte. ¿Tu negocio ya tiene redes sociales o materiales de marca?",
      en: "Perfect. We can start with something simple: a professional site that clearly shows who you are, what you offer and how people can reach you. Does your business already have social media or brand materials?",
    },
    interes: { es: "presencia en internet", en: "an online presence" },
  },
  {
    id: "tecnologia",
    peso: 1.6,
    claves: {
      es: [
        "no entiendo nada",
        "no se de tecnologia",
        "no entiendo de tecnologia",
        "no se nada de tecnologia",
        "no soy bueno con la tecnologia",
        "no soy buena con la tecnologia",
        "no se de computacion",
      ],
      en: ["i don t understand", "not good with technology", "don t know about technology", "not tech savvy", "i m not technical"],
    },
    respuesta: {
      es: "No pasa nada, no necesitas saber de tecnología. Explícame tu idea o tu problema con tus propias palabras y yo te lo explico de forma sencilla.",
      en: "No problem, you don't need to know about technology. Explain your idea or your problem in your own words and I'll explain things simply.",
    },
  },

  // ---------- Precios, pagos y presupuesto ----------
  {
    id: "costos",
    peso: 1.6,
    claves: {
      es: ["cuanto cuesta", "cuanto cobran", "cuanto sale", "cuanto me cobrarian", "costo", "costos", "precio", "precios", "tarifa", "tarifas", "inversion"],
      en: ["how much", "how much does it cost", "cost", "costs", "price", "prices", "pricing", "rate", "rates", "fee", "fees", "investment", "charge"],
    },
    respuesta: {
      es: "Depende del alcance: si necesitas una página informativa, una tienda en línea, un portal o funciones especiales. Cuéntame brevemente qué necesitas y te oriento sobre el tipo de proyecto.",
      en: "It depends on the scope: whether you need an informational site, an online store, a portal or special features. Tell me briefly what you need and I'll point you to the right kind of project.",
    },
  },
  {
    id: "pagos",
    peso: 1.8,
    deriva: true,
    claves: {
      es: ["pagos mensuales", "pago mensual", "mensualidades", "a meses", "meses sin intereses", "formas de pago", "financiamiento", "plazos de pago", "pagar en partes"],
      en: ["monthly payments", "monthly payment", "installments", "payment plan", "payment options", "financing", "pay in parts"],
    },
    respuesta: {
      es: "Podemos revisar opciones de pago según el proyecto. Si me dejas tu nombre y un correo o teléfono, el equipo puede explicarte las alternativas disponibles.",
      en: "We can look at payment options depending on the project. If you leave me your name and an email or phone number, the team can walk you through the available options.",
    },
    interes: { es: "opciones de pago", en: "payment options" },
  },
  {
    id: "presupuesto",
    peso: 1.8,
    claves: {
      es: ["poco presupuesto", "bajo presupuesto", "presupuesto limitado", "presupuesto corto", "no tengo mucho dinero", "algo economico", "economico", "barato", "barata"],
      en: ["small budget", "low budget", "limited budget", "tight budget", "not much money", "cheap", "affordable"],
    },
    respuesta: {
      es: "Te entiendo. Muchas veces se puede comenzar con una versión más sencilla y crecer después. Cuéntame qué es lo más importante para ti ahora y vemos una opción realista.",
      en: "I understand. Often you can start with a simpler version and grow later. Tell me what matters most to you right now and we'll find a realistic option.",
    },
  },

  // ---------- Tiempos y proceso ----------
  {
    id: "tiempos",
    peso: 1.6,
    claves: {
      es: ["cuanto tarda", "cuanto tardan", "cuanto tiempo", "cuanto se tardan", "tiempo", "tiempos", "plazo", "plazos", "entrega", "fecha"],
      en: ["how long", "how much time", "how fast", "time", "timeline", "timelines", "turnaround", "deadline", "deadlines", "delivery", "date"],
    },
    respuesta: {
      es: "El tiempo depende del tamaño del proyecto, el contenido y las funciones. Una página sencilla suele ser más rápida que una tienda o un sistema. Cuéntame qué necesitas y te doy una idea más cercana.",
      en: "Timing depends on the size of the project, the content and the features. A simple site is usually faster than a store or a system. Tell me what you need and I'll give you a closer idea.",
    },
  },
  {
    id: "proceso",
    peso: 1.6,
    claves: {
      es: ["como trabajan", "como funciona el proceso", "como funciona", "proceso", "metodologia", "pasos", "etapas"],
      en: ["how do you work", "how does the process work", "how does it work", "process", "methodology", "steps", "stages", "workflow"],
    },
    respuesta: {
      es: "Primero entendemos tu objetivo, después definimos el alcance y el diseño, luego desarrollamos y finalmente hacemos pruebas antes de publicar. En cada etapa te mantenemos informado.",
      en: "First we understand your goal, then we define the scope and design, then we build, and finally we test before launching. We keep you informed at every stage.",
    },
  },
  {
    id: "contenido-cliente",
    peso: 1.7,
    claves: {
      es: [
        "tengo que dar el contenido",
        "yo doy el contenido",
        "yo pongo el contenido",
        "quien hace el contenido",
        "quien pone el contenido",
        "tengo que dar los textos",
        "ustedes hacen los textos",
        "tengo que mandar fotos",
      ],
      en: ["do i provide the content", "do i have to provide", "who writes the content", "who provides the content", "do you write the copy", "do i send photos"],
    },
    respuesta: {
      es: "Idealmente sí: textos, logotipo, fotos e información de tu negocio ayudan a que el proyecto refleje mejor tu marca. Si no tienes todo, también podemos apoyarte con la estructura o el contenido.",
      en: "Ideally yes: copy, logo, photos and information about your business help the project reflect your brand. If you don't have everything, we can also help with the structure or the content.",
    },
  },

  // ---------- Servicios (solo si se preguntan) ----------
  {
    id: "servicios",
    peso: 0.8,
    claves: {
      es: ["que hacen", "que ofrecen", "a que se dedican", "en que me pueden ayudar", "servicio", "servicios", "catalogo"],
      en: ["what do you do", "what do you offer", "what do you provide", "how can you help", "service", "services", "catalog"],
    },
    respuesta: {
      es: "Creamos soluciones digitales para negocios y organizaciones: desde sitios web y sistemas hasta identidad visual, contenido y asistentes virtuales. Pero cuéntame qué necesitas resolver y te digo la opción que más te conviene.",
      en: "We build digital solutions for businesses and organizations: from websites and systems to visual identity, content and virtual assistants. But tell me what you need to solve and I'll tell you the option that suits you best.",
    },
  },
  {
    id: "web",
    claves: {
      es: ["pagina web", "paginas web", "sitio web", "sitios web", "mi sitio", "mi pagina", "pagina", "paginas", "sitio", "sitios", "web", "landing", "rediseno"],
      en: ["web page", "web pages", "webpage", "website", "websites", "web site", "my site", "my website", "landing page", "page", "pages", "site", "sites", "web", "landing", "redesign"],
    },
    respuesta: {
      es: "Sí. Podemos crear desde una página informativa hasta un sitio más completo con formularios, catálogos o tienda. ¿Qué tipo de proyecto tienes en mente?",
      en: "Yes. We can build anything from an informational page to a more complete site with forms, catalogs or a store. What kind of project do you have in mind?",
    },
    interes: { es: "una página web", en: "a website" },
  },
  {
    id: "tienda",
    peso: 1.3,
    claves: {
      es: ["tienda en linea", "tiendas en linea", "tienda online", "tienda virtual", "ecommerce", "e commerce", "vender en linea", "vender por internet", "carrito de compras"],
      en: ["online store", "online stores", "online shop", "ecommerce", "e commerce", "sell online", "shopping cart"],
    },
    respuesta: {
      es: "Sí, desarrollamos tiendas en línea. ¿Ya tienes productos, precios e imágenes, o estás apenas organizando esa parte?",
      en: "Yes, we build online stores. Do you already have products, prices and images, or are you still putting that part together?",
    },
    interes: { es: "una tienda en línea", en: "an online store" },
  },
  {
    id: "sistemas",
    claves: {
      es: ["sistema", "sistemas", "a la medida", "procesos", "automatizar", "herramienta", "herramientas", "aplicacion", "app", "software", "intranet"],
      en: ["system", "systems", "custom", "processes", "automate", "tool", "tools", "application", "app", "software", "intranet"],
    },
    respuesta: {
      es: "Sí, podemos desarrollar sistemas a la medida para organizar información, automatizar procesos o manejar operaciones internas. Cuéntame qué problema quieres resolver.",
      en: "Yes, we can build custom systems to organize information, automate processes or handle internal operations. Tell me what problem you want to solve.",
    },
    interes: { es: "un sistema a la medida", en: "a custom system" },
  },
  {
    id: "portales",
    claves: {
      es: ["portal", "portales", "plataforma", "plataformas", "tramite", "tramites", "transparencia"],
      en: ["portal", "portals", "platform", "platforms", "procedure", "procedures", "transparency"],
    },
    respuesta: {
      es: (c) => `${c.portales} ¿Es para un municipio, una empresa u otra organización?`,
      en: (c) => `${c.portales} Is it for a municipality, a company or another organization?`,
    },
    interes: { es: "un portal", en: "a portal" },
  },
  {
    id: "diseno",
    claves: {
      es: ["logo", "logos", "logotipo", "identidad", "identidad visual", "marca", "branding", "diseno grafico", "disen*", "flyer", "folleto", "papeleria"],
      en: ["logo", "logos", "logotype", "identity", "visual identity", "brand", "branding", "graphic design", "design*", "flyer", "brochure", "stationery"],
    },
    respuesta: {
      es: "Sí, trabajamos identidad visual: logotipo, colores, tipografías y lineamientos para que tu marca se vea coherente en todos lados. ¿Ya tienes una idea de cómo quieres que se perciba tu negocio?",
      en: "Yes, we work on visual identity: logo, colors, typography and guidelines so your brand looks consistent everywhere. Do you already have an idea of how you want your business to be perceived?",
    },
    interes: { es: "identidad visual", en: "visual identity" },
  },
  {
    id: "chatbots",
    // Pesa más que «¿Quién eres?» para que «¿hacen chatbots con IA?» hable del servicio.
    peso: 1.9,
    claves: {
      es: ["chatbot", "chatbots", "bot", "bots", "asistente virtual", "asistentes virtuales", "chatbot con ia", "chatbot con inteligencia artificial", "atencion automatica"],
      en: ["chatbot", "chatbots", "bot", "bots", "virtual assistant", "virtual assistants", "ai chatbot", "chatbot with ai", "automated support"],
    },
    respuesta: {
      es: "Sí. Creamos asistentes que conversan con tus clientes, responden dudas frecuentes y pueden tomar datos para que tu equipo dé seguimiento. ¿Lo quieres para tu página, WhatsApp u otro canal?",
      en: "Yes. We create assistants that talk with your customers, answer frequent questions and can take down details so your team can follow up. Do you want it for your website, WhatsApp or another channel?",
    },
    interes: { es: "un chatbot", en: "a chatbot" },
  },
  {
    id: "redes",
    claves: {
      es: ["redes", "redes sociales", "facebook", "instagram", "tiktok", "publicaciones", "community", "marketing"],
      en: ["social", "social media", "socials", "facebook", "instagram", "tiktok", "posts", "community", "marketing"],
    },
    respuesta: {
      es: "Sí, manejamos redes sociales: estrategia, calendario y publicaciones con una voz constante. ¿Ya tienes cuentas activas o empezarías desde cero?",
      en: "Yes, we handle social media: strategy, calendar and posts with a consistent voice. Do you already have active accounts or would you start from scratch?",
    },
    interes: { es: "redes sociales", en: "social media" },
  },
  {
    id: "foto",
    claves: {
      es: ["foto", "fotos", "fotograf*", "sesion de fotos", "imagenes"],
      en: ["photo", "photos", "photograph*", "photoshoot", "pictures", "images"],
    },
    respuesta: {
      es: "Sí, hacemos fotografía institucional, de producto y de espacios. ¿Qué te gustaría fotografiar?",
      en: "Yes, we do institutional, product and space photography. What would you like to photograph?",
    },
    interes: { es: "fotografía", en: "photography" },
  },
  {
    id: "video",
    claves: {
      es: ["video", "videos", "grabacion", "grabar", "audiovisual", "reel", "reels", "spot"],
      en: ["video", "videos", "recording", "film*", "audiovisual", "reel", "reels", "spot"],
    },
    respuesta: {
      es: "Sí, hacemos piezas de video breves para presentar servicios, proyectos y mensajes. ¿Para dónde sería el video: redes, tu página o una presentación?",
      en: "Yes, we make short video pieces to present services, projects and messages. Where would the video go: social media, your site or a presentation?",
    },
    interes: { es: "video", en: "video" },
  },
  {
    id: "contenido",
    claves: {
      es: ["contenido", "contenidos", "contenido digital", "creativo", "produccion", "textos"],
      en: ["content", "digital content", "creative", "production", "copywriting"],
    },
    respuesta: {
      es: "Producimos contenido pensado para comunicar y conectar con tu audiencia: textos, recursos visuales y materiales para tu presencia en línea. ¿Qué te gustaría comunicar?",
      en: "We produce content designed to communicate and connect with your audience: copy, visuals and materials for your online presence. What would you like to communicate?",
    },
    interes: { es: "contenido digital", en: "digital content" },
  },
  {
    id: "seguridad",
    peso: 1.6,
    claves: {
      es: ["seguridad", "es seguro", "es segura", "proteccion", "proteger", "datos personales", "privacidad", "hackeo", "hackear", "vpn", "acceso protegido", "panel de administracion"],
      en: ["security", "secure", "is it safe", "protection", "protect", "personal data", "privacy", "hack*", "vpn", "protected access", "admin panel"],
    },
    respuesta: {
      es: (c) => `${c.seguridad} Los detalles los revisa el equipo directamente contigo. [Ver cómo se entra al panel](#seguridad)`,
      en: (c) => `${c.seguridad} The team goes over the details directly with you. [See how the panel sign-in works](#seguridad)`,
    },
  },
  {
    id: "mantenimiento",
    peso: 1.5,
    claves: {
      es: ["actualiz*", "mantenimiento", "administrar", "editar", "nosotros mismos", "yo mismo", "yo misma", "autoadministrable", "panel"],
      en: ["updat*", "maintenance", "maintain", "manage", "edit", "ourselves", "myself", "self managed", "cms", "panel"],
    },
    respuesta: {
      es: "Sí. Los portales incluyen un panel para que tu equipo publique por su cuenta, y seguimos acompañándote después de publicar. ¿Quién se encargaría de actualizarlo en tu caso?",
      en: "Yes. Portals include a panel so your team can publish on their own, and we keep supporting you after launch. Who would be in charge of updating it on your side?",
    },
  },

  // ---------- Soporte y casos que ve el equipo ----------
  {
    id: "soporte",
    peso: 1.8,
    deriva: true,
    claves: {
      es: ["no funciona", "no carga", "se cayo", "esta caida", "esta caido", "no abre", "no sirve", "no envia", "me sale un error", "error", "falla", "fallando"],
      en: ["not working", "doesn t work", "won t load", "doesn t load", "is down", "went down", "broken", "error", "crash*", "not sending"],
    },
    respuesta: {
      es: "Lamento eso. Cuéntame qué está pasando: ¿no carga, se ve mal en el celular, no envía formularios o aparece algún error? Con eso puedo pasarlo al equipo correcto.",
      en: "Sorry about that. Tell me what's happening: does it not load, look wrong on mobile, not send forms, or show an error? With that I can pass it to the right people on the team.",
    },
    interes: { es: "soporte para mi página", en: "support for my website" },
  },
  {
    id: "urgente",
    peso: 1.9,
    deriva: true,
    claves: {
      es: ["urgente", "urgencia", "emergencia", "ayuda urgente", "lo antes posible", "cuanto antes", "rapido por favor"],
      en: ["urgent", "urgently", "emergency", "asap", "as soon as possible", "right away"],
    },
    respuesta: {
      es: "Entiendo. Cuéntame brevemente qué ocurre y, si requiere atención inmediata, tomo tus datos para que el equipo te contacte lo antes posible.",
      en: "I understand. Tell me briefly what's going on and, if it needs immediate attention, I'll take your details so the team can contact you as soon as possible.",
    },
    interes: { es: "un caso urgente", en: "an urgent case" },
  },
  {
    id: "nadie-responde",
    peso: 1.9,
    deriva: true,
    claves: {
      es: ["nadie me responde", "nadie me contesta", "nadie contesta", "no me contestan", "no me responden", "sigo esperando", "no me han contestado"],
      en: ["nobody answers", "nobody replies", "no one answers", "no one replies", "no one is answering", "still waiting", "haven t heard back"],
    },
    respuesta: {
      es: "Lamento la espera. Déjame tus datos y una descripción corta de tu caso para que el equipo te contacte con prioridad.",
      en: "Sorry for the wait. Leave me your details and a short description of your case so the team can contact you as a priority.",
    },
    interes: { es: "seguimiento de un caso", en: "follow-up on a case" },
  },
  {
    id: "cotizacion",
    peso: 1.8,
    deriva: true,
    claves: {
      es: ["cotizacion", "cotizaciones", "cotiz*", "propuesta", "quiero contratar", "contratar", "contratarlos", "presupuesto formal"],
      en: ["quote", "quotes", "quotation", "estimate", "proposal", "hire you", "hire", "i want to hire"],
    },
    respuesta: {
      es: "Claro. Para prepararla bien, cuéntame qué proyecto necesitas y cuál es tu objetivo principal. Si me compartes tu nombre y un correo o teléfono, el equipo puede darte una propuesta.",
      en: "Of course. To prepare it properly, tell me what project you need and your main goal. If you share your name and an email or phone number, the team can send you a proposal.",
    },
  },
  {
    id: "persona",
    peso: 2,
    deriva: true,
    claves: {
      es: [
        "hablar con una persona",
        "hablar con alguien",
        "hablar con un humano",
        "una persona real",
        "persona real",
        "un humano",
        "asesor",
        "asesora",
        "agente",
        "ejecutivo",
        "atencion humana",
      ],
      en: ["talk to a person", "talk to someone", "speak to someone", "talk to a human", "real person", "a human", "advisor", "agent", "representative", "human support"],
    },
    respuesta: {
      es: "Claro, con gusto te comunico con el equipo. ¿Me compartes tu nombre, un correo o teléfono y me cuentas brevemente tu asunto?",
      en: "Of course, I'm happy to put you in touch with the team. Could you share your name, an email or phone number, and briefly tell me what it's about?",
    },
  },
  {
    id: "mandar-proyecto",
    peso: 1.7,
    deriva: true,
    claves: {
      es: ["mandar mi proyecto", "enviar mi proyecto", "compartir mi proyecto", "mandarles mi proyecto", "tengo un proyecto", "tengo una idea", "mi proyecto", "empezar un proyecto", "iniciar un proyecto"],
      en: ["send my project", "share my project", "send you my project", "i have a project", "i have an idea", "my project", "start a project"],
    },
    respuesta: {
      es: "Sí, cuéntame de qué se trata o compárteme los detalles que tengas. Con eso puedo orientarte mejor y pasarlo al equipo si necesitas una propuesta.",
      en: "Yes, tell me what it's about or share whatever details you have. With that I can guide you better and pass it to the team if you need a proposal.",
    },
  },
  {
    id: "contacto",
    peso: 1.6,
    claves: {
      es: ["contacto", "contactar", "contactarlos", "como los contacto", "whatsapp", "correo", "email", "mail", "telefono", "llamar*", "llamada*", "numero", "celular"],
      en: ["contact", "reach you", "how do i contact", "whatsapp", "email", "mail", "phone", "telephone", "call*", "number", "cell"],
    },
    respuesta: {
      es: (c) => `Puedes [escribirle al equipo por WhatsApp](whatsapp:) o mandar un correo a [${c.correo}](correo:). Por ahora no atendemos llamadas, pero por ahí te responden.`,
      en: (c) => `You can [message the team on WhatsApp](whatsapp:) or send an email to [${c.correo}](correo:). We don't take calls for now, but they'll reply to you there.`,
    },
  },
  {
    id: "ubicacion",
    peso: 1.6,
    claves: {
      es: ["donde estan", "de donde son", "ubicacion", "ubicados", "oficina", "oficinas", "direccion", "presencial", "visitarlos"],
      en: ["where are you", "where are you based", "location", "located", "office", "offices", "address", "in person", "visit you"],
    },
    respuesta: {
      es: "Atendemos por WhatsApp y correo, así que podemos trabajar contigo estés donde estés. Si quieres, te paso con el equipo para coordinar.",
      en: "We work through WhatsApp and email, so we can work with you wherever you are. If you like, I can put you in touch with the team to coordinate.",
    },
  },
  {
    id: "redes-northa",
    peso: 1.8,
    claves: {
      es: ["sus redes", "tienen redes", "su facebook", "su instagram", "tienen facebook", "tienen instagram", "redes de northa", "seguirlos"],
      en: ["your social media", "your socials", "your facebook", "your instagram", "do you have social", "follow you"],
    },
    respuesta: {
      es: "Por ahora Northa no tiene perfiles propios publicados. Para hablar con nosotros, lo mejor es [WhatsApp](whatsapp:) o el [correo](correo:).",
      en: "For now Northa doesn't have its own public profiles. To talk with us, [WhatsApp](whatsapp:) or [email](correo:) works best.",
    },
  },
  {
    id: "trabajo",
    claves: {
      es: ["portafolio", "trabajos", "sus proyectos", "que proyectos", "han trabajado", "experiencia", "ejemplo", "ejemplos", "han hecho", "referencias", "muestras", "clientes", "municipio", "municipios", "municipal", "ayuntamiento"],
      en: ["portfolio", "your work", "your projects", "what projects", "past work", "experience", "example", "examples", "references", "samples", "clients", "municipality", "municipalities", "municipal", "city hall"],
    },
    respuesta: {
      es: (c) =>
        `Tenemos ${c.total} portales municipales en línea que puedes visitar en el [portafolio](#portafolio). También trabajamos con empresas y negocios. ¿Tu proyecto se parece a alguno?`,
      en: (c) =>
        `We have ${c.total} municipal portals online that you can visit in the [portfolio](#portafolio). We also work with companies and businesses. Is your project similar to any of them?`,
    },
  },
  {
    id: "para-quien",
    peso: 0.8,
    claves: {
      es: ["gobierno", "gobiernos", "institucion", "instituciones", "empresa", "empresas", "negocio", "negocios", "organizacion", "organizaciones", "asociacion", "escuela", "universidad"],
      en: ["government", "governments", "institution", "institutions", "company", "companies", "business", "businesses", "organization", "organizations", "association", "school", "university", "nonprofit"],
    },
    respuesta: {
      es: "Trabajamos con negocios, empresas, instituciones y gobiernos que necesitan verse profesionales y tener herramientas que funcionen. Cuéntame un poco del tuyo.",
      en: "We work with businesses, companies, institutions and governments that need to look professional and have tools that work. Tell me a bit about yours.",
    },
  },

  // ---------- Preguntas generales ----------
  {
    id: "que-es-chatbot",
    peso: 2,
    claves: {
      es: ["que es un chatbot", "que es un bot", "que es un asistente virtual", "como funciona un chatbot", "para que sirve un chatbot"],
      en: ["what is a chatbot", "what s a chatbot", "what is a bot", "what is a virtual assistant", "how does a chatbot work"],
    },
    respuesta: {
      es: "Es un asistente digital que conversa con las personas: responde preguntas, recibe solicitudes y puede pasar casos importantes a tu equipo. Básicamente ayuda a atender mejor sin que tu gente tenga que estar pendiente todo el tiempo.",
      en: "It's a digital assistant that talks with people: it answers questions, takes requests and can pass important cases to your team. Basically it helps you serve people better without your staff having to be on call all the time.",
    },
  },
  {
    id: "para-que-web",
    peso: 2,
    claves: {
      es: ["para que me sirve una pagina", "para que sirve una pagina", "de que me sirve una pagina", "para que quiero una pagina", "para que sirve un sitio", "por que tener una pagina", "vale la pena una pagina"],
      en: ["what is a website for", "why do i need a website", "what good is a website", "is a website worth it", "why have a website"],
    },
    respuesta: {
      es: "Para que las personas te encuentren, entiendan rápido qué ofreces y puedan contactarte o comprar. También le da a tu negocio una imagen más profesional y confiable.",
      en: "So people can find you, quickly understand what you offer, and contact you or buy. It also gives your business a more professional, trustworthy image.",
    },
  },
  {
    id: "seo",
    peso: 1.8,
    claves: {
      es: ["seo", "que es seo", "posicionamiento", "aparecer en google", "salir en google", "salir primero en google", "google"],
      en: ["seo", "what is seo", "ranking", "rank on google", "show up on google", "appear on google", "google"],
    },
    respuesta: {
      es: "Es el trabajo para que tu sitio aparezca mejor posicionado en Google cuando alguien busca lo que ofreces. No es magia: combina contenido útil, estructura técnica y presencia digital.",
      en: "It's the work of getting your site to rank better on Google when someone searches for what you offer. It isn't magic: it combines useful content, technical structure and digital presence.",
    },
    interes: { es: "posicionamiento en Google", en: "Google ranking" },
  },
  {
    id: "otra-cosa",
    peso: 1.5,
    claves: {
      es: ["ayudarme con otra cosa", "otra cosa", "otra pregunta", "otra duda", "algo mas", "puedes ayudarme"],
      en: ["help me with something else", "something else", "another question", "one more question", "can you help me"],
    },
    respuesta: {
      es: "Claro, dime qué necesitas y vemos cómo te ayudo.",
      en: "Sure, tell me what you need and we'll see how I can help.",
    },
  },

  // ---------- Cortesía ----------
  {
    id: "gracias",
    peso: 0.6,
    claves: {
      es: ["gracias", "muchas gracias", "mil gracias", "te agradezco", "muy amable", "perfecto", "excelente", "genial"],
      en: ["thanks", "thank you", "thanks a lot", "appreciate it", "perfect", "great", "excellent", "awesome"],
    },
    respuesta: {
      es: "¡Con gusto! Si más adelante tienes otra duda o quieres avanzar con tu proyecto, aquí estoy.",
      en: "My pleasure! If you have another question later or want to move forward with your project, I'm here.",
    },
  },
  {
    id: "despedida",
    peso: 0.6,
    claves: {
      es: ["adios", "hasta luego", "hasta pronto", "bye", "nos vemos", "me voy", "chao", "bai"],
      en: ["bye", "goodbye", "see you", "see you later", "talk later", "gotta go"],
    },
    respuesta: {
      es: "¡Claro! Fue un gusto ayudarte. Que tengas excelente día.",
      en: "Of course! It was a pleasure helping you. Have a great day.",
    },
  },
  {
    id: "saludo",
    peso: 0.5,
    claves: {
      es: ["hola", "holi", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches", "que tal", "que onda", "hey"],
      en: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "what s up"],
    },
    respuesta: {
      es: (c, e) => {
        if (e.includes("buenas tardes")) return "¡Buenas tardes! ¿En qué andas hoy? Cuéntame tu idea, duda o proyecto y vemos cómo ayudarte.";
        if (e.includes("buenas noches")) return "¡Buenas noches! Cuéntame tu idea, duda o proyecto y vemos cómo ayudarte.";
        if (e.includes("buenos dias") || e.includes("buen dia")) return "¡Buenos días! ¿Cómo va tu día? Cuéntame en qué te puedo ayudar.";
        return "¡Hola! ¿Cómo va tu día? Cuéntame en qué te puedo ayudar.";
      },
      en: (c, e) => {
        if (e.includes("good afternoon")) return "Good afternoon! What are you working on today? Tell me your idea, question or project and we'll see how to help.";
        if (e.includes("good evening")) return "Good evening! Tell me your idea, question or project and we'll see how to help.";
        if (e.includes("good morning")) return "Good morning! How's your day going? Tell me how I can help.";
        return "Hi! How's your day going? Tell me how I can help.";
      },
    },
  },
];

// Frases fijas de Nora fuera de los temas.
const textosBase = {
  saludoInicial: {
    es: "¡Hola! Soy Nora, de Northa Digital. ¿Cómo va tu día? Cuéntame en qué te puedo ayudar.",
    en: "Hi! I'm Nora, from Northa Digital. How's your day going? Tell me how I can help.",
  },
  // Cuando el chat se abre desde un servicio de la página.
  saludoServicio: {
    es: (s) => `¡Hola! Soy Nora, de Northa Digital. Veo que quieres saber más sobre ${s}. Cuéntame un poco de tu proyecto y te oriento.`,
    en: (s) => `Hi! I'm Nora, from Northa Digital. I see you're interested in ${s}. Tell me a bit about your project and I'll guide you.`,
  },
  servicio: {
    es: (s) => `Veo que quieres saber más sobre ${s}. Cuéntame un poco de tu proyecto y te oriento.`,
    en: (s) => `I see you're interested in ${s}. Tell me a bit about your project and I'll guide you.`,
  },
  // Cómo se nombra cada servicio de la página en la conversación.
  servicios: {
    es: {
      "portales-sistemas": "los portales y sistemas digitales",
      "desarrollo-web": "el desarrollo web",
      "redes-sociales": "el manejo de redes sociales",
      fotografia: "la fotografía",
      video: "el video",
      "diseno-grafico": "el diseño gráfico",
      chatbots: "los chatbots",
      seguridad: "la seguridad de tus plataformas",
    },
    en: {
      "portales-sistemas": "digital portals and systems",
      "desarrollo-web": "web development",
      "redes-sociales": "social media management",
      fotografia: "photography",
      video: "video",
      "diseno-grafico": "graphic design",
      chatbots: "chatbots",
      seguridad: "platform security",
    },
  },
  claro: { es: "Claro.", en: "Of course." },
  seguimiento: {
    es: "Perfecto, con eso ya me doy una idea para que el equipo te prepare algo a tu medida.",
    en: "Perfect, that gives me a good idea so the team can put together something tailored to you.",
  },
  noEntendido: {
    es: "Mmm, esa no la tengo clara. ¿Me la cuentas con otras palabras? Si es algo que debe ver el equipo, con gusto te paso con ellos.",
    en: "Hmm, I'm not sure I got that. Could you put it another way? If it's something the team should look at, I'm happy to put you in touch.",
  },
  sensible: {
    es: "Por tu seguridad, mejor no compartas contraseñas, datos de tarjeta ni documentos por aquí. Con tu nombre y un correo o teléfono es suficiente para que el equipo te contacte.",
    en: "For your security, please don't share passwords, card details or documents here. Your name and an email or phone number are enough for the team to contact you.",
  },
  molesto: {
    es: "Entiendo que algo no salió como esperabas y lamento la molestia. Si quieres, te paso con el equipo para que lo revise directamente: déjame tu nombre y un correo o teléfono.",
    en: "I understand something didn't go as expected, and I'm sorry for the trouble. If you like, I'll pass this to the team so they can look at it directly: leave me your name and an email or phone number.",
  },
  cancelar: {
    es: "Va, sin problema. Aquí sigo si cambias de opinión.",
    en: "Sure, no problem. I'm here if you change your mind.",
  },
  contactoInvalido: {
    es: "Ese dato no parece un correo o teléfono completo. ¿Me lo escribes de nuevo?",
    en: "That doesn't look like a complete email or phone number. Could you type it again?",
  },
  recordatorio: {
    es: "Cuando quieras, me pasas tus datos y lo dejo listo para el equipo.",
    en: "Whenever you're ready, send me your details and I'll get it ready for the team.",
  },
  // Lo que falta para pasar el caso. Cada clave es una combinación.
  faltan: {
    es: {
      todo: "¿Me cuentas brevemente de qué se trata y me compartes tu nombre y un correo o teléfono?",
      nombreContacto: "¿Me compartes tu nombre y un correo o teléfono para que el equipo te contacte?",
      asuntoContacto: (n) => `Gracias, ${n}. ¿Me cuentas brevemente de qué se trata y me dejas un correo o teléfono?`,
      asuntoNombre: "¿Me cuentas brevemente de qué se trata y cómo te llamas?",
      contacto: (n) => (n ? `Gracias, ${n}. ¿Me dejas un correo o teléfono para que el equipo te contacte?` : "¿Me dejas un correo o teléfono para que el equipo te contacte?"),
      nombre: "Perfecto. ¿Y cómo te llamas?",
      asunto: (n) => (n ? `Gracias, ${n}. ¿Me cuentas brevemente de qué se trata?` : "¿Me cuentas brevemente de qué se trata?"),
    },
    en: {
      todo: "Could you tell me briefly what it's about and share your name and an email or phone number?",
      nombreContacto: "Could you share your name and an email or phone number so the team can contact you?",
      asuntoContacto: (n) => `Thanks, ${n}. Could you tell me briefly what it's about and leave an email or phone number?`,
      asuntoNombre: "Could you tell me briefly what it's about and what your name is?",
      contacto: (n) => (n ? `Thanks, ${n}. Could you leave an email or phone number so the team can contact you?` : "Could you leave an email or phone number so the team can contact you?"),
      nombre: "Perfect. And what's your name?",
      asunto: (n) => (n ? `Thanks, ${n}. Could you tell me briefly what it's about?` : "Could you tell me briefly what it's about?"),
    },
  },
  listo: {
    es: (n) =>
      `Listo, ${n}. Ya tengo lo necesario: [envía tu mensaje al equipo por WhatsApp](whatsapp:). Se abre con tus datos y nada se envía hasta que tú lo mandes. Si prefieres, también puedes escribir a [${site.contact.email}](correo:).`,
    en: (n) =>
      `All set, ${n}. I have what I need: [send your message to the team on WhatsApp](whatsapp:). It opens with your details and nothing is sent until you send it. If you prefer, you can also write to [${site.contact.email}](correo:).`,
  },
  // Cuerpo del mensaje al equipo (el saludo con el nombre lo añade site.js).
  mensaje: {
    es: ({ asunto, contacto, esCorreo }) =>
      [`Asunto: ${asunto}`, `${esCorreo ? "Correo" : "Teléfono"}: ${contacto}`, "", "¿Me pueden ayudar?"].join("\n"),
    en: ({ asunto, contacto, esCorreo }) =>
      [`Subject: ${asunto}`, `${esCorreo ? "Email" : "Phone"}: ${contacto}`, "", "Could you help me?"].join("\n"),
  },
  asuntoCorreo: { es: "Contacto desde northadigital.com", en: "Contact from northadigital.com" },
};

export const getAsistente = porIdioma((locale) => {
  const servicios = getServicios(locale);
  const contexto = {
    portales: servicios.find((s) => s.id === "portales-sistemas")?.description ?? "",
    seguridad: getSeguridad(locale).description,
    total: getProyectoDestacado(locale)?.enlaces?.length ?? 0,
    correo: site.contact.email,
  };

  const temas = localizar(temasBase, locale).map((t) => ({
    ...t,
    responder: (entrada) => (typeof t.respuesta === "function" ? t.respuesta(contexto, entrada) : t.respuesta),
  }));

  return { temas, textos: localizar(textosBase, locale) };
});
