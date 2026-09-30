import type { L, LList } from "@/lib/l10n";

/**
 * Servicios de Northa, ordenados por intención de búsqueda (lo que la gente
 * escribe en Google), no por lo que más facturamos. Gobierno vive aparte en
 * `content/gov.ts` y en la ruta /gobierno.
 *
 * Regla de la casa: nada se inventa. Aquí no hay precios, cifras de clientes
 * ni plazos que no hayamos dicho antes. Las afirmaciones sobre la flota de
 * portales salen de northa-landing/README.md.
 */

export type ServiceSlug =
  | "desarrollo-web"
  | "sistemas-a-la-medida"
  | "aplicaciones"
  | "inteligencia-artificial"
  | "mantenimiento-web"
  | "consultoria-tecnologica";

export type ServiceIcon = "globe" | "dashboard" | "smartphone" | "sparkles" | "wrench" | "compass";

export interface Service {
  slug: ServiceSlug;
  icon: ServiceIcon;
  /** Nombre corto para tarjetas y menús. */
  name: L;
  /** Una línea para la tarjeta del home. */
  short: L;
  /** H1 y <title> de la página del servicio (con la búsqueda local). */
  seoTitle: L;
  seoDescription: L;
  keywords: LList;
  intro: L;
  forWho: L;
  includes: LList;
  steps: { title: L; body: L }[];
  stack: string[];
  faq: { q: L; a: L }[];
  related: ServiceSlug[];
}

export const services: Service[] = [
  {
    slug: "desarrollo-web",
    icon: "globe",
    name: { es: "Páginas web profesionales", en: "Professional websites" },
    short: {
      es: "Sitios rápidos, fáciles de encontrar en Google y de actualizar.",
      en: "Fast websites that are easy to find on Google and easy to update.",
    },
    seoTitle: {
      es: "Diseño y desarrollo de páginas web en Hermosillo",
      en: "Web design & development in Hermosillo, Sonora",
    },
    seoDescription: {
      es: "Páginas web a la medida en Hermosillo, Sonora: rápidas, optimizadas para Google y con panel para actualizarlas. Cotiza por WhatsApp.",
      en: "Custom websites in Hermosillo, Sonora: fast, optimized for Google and with an admin panel to keep them updated. Get a quote on WhatsApp.",
    },
    keywords: {
      es: ["páginas web Hermosillo", "diseño web Hermosillo", "desarrollo web Sonora", "página web para negocio"],
      en: ["web design Hermosillo", "web development Sonora", "website for business Mexico"],
    },
    intro: {
      es: "Tu página web trabaja todo el día: aparece en Google, explica lo que haces y convierte visitas en mensajes. La diseñamos a la medida de tu negocio y la construimos con la misma tecnología que usan los equipos de producto más exigentes.",
      en: "Your website works around the clock: it shows up on Google, explains what you do and turns visits into messages. We design it around your business and build it with the same technology demanding product teams use.",
    },
    forWho: {
      es: "Negocios, profesionistas, despachos, restaurantes e instituciones que quieren dejar de depender solo de las redes sociales.",
      en: "Businesses, professionals, firms, restaurants and institutions that want to stop depending only on social media.",
    },
    includes: {
      es: [
        "Diseño a la medida, pensado primero para celular",
        "Estructura y textos preparados para SEO local",
        "Imágenes en AVIF y WebP, y carga optimizada",
        "WhatsApp, formularios y analítica sin cookies invasivas",
        "Dominio, certificado SSL y hosting configurados",
        "Panel para editar contenido, si tu proyecto lo necesita",
      ],
      en: [
        "Custom design, mobile first",
        "Structure and copy ready for local SEO",
        "AVIF and WebP images, optimized loading",
        "WhatsApp, forms and cookie-light analytics",
        "Domain, SSL certificate and hosting configured",
        "Content admin panel, if your project needs one",
      ],
    },
    steps: [
      {
        title: { es: "Descubrimiento", en: "Discovery" },
        body: {
          es: "Objetivos, público, competencia y qué debe lograr cada página.",
          en: "Goals, audience, competitors and what each page must achieve.",
        },
      },
      {
        title: { es: "Diseño", en: "Design" },
        body: {
          es: "Estructura, identidad y prototipo que puedes revisar desde tu celular.",
          en: "Structure, identity and a prototype you can review on your phone.",
        },
      },
      {
        title: { es: "Desarrollo", en: "Build" },
        body: {
          es: "Construcción por entregas cortas, probadas en celular antes de publicarse.",
          en: "Short, reviewable iterations, tested on mobile before going live.",
        },
      },
      {
        title: { es: "Lanzamiento", en: "Launch" },
        body: {
          es: "Dominio, SEO técnico, analítica y verificación sobre la URL real.",
          en: "Domain, technical SEO, analytics and verification on the real URL.",
        },
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Cloudflare"],
    faq: [
      {
        q: { es: "¿Cuánto cuesta una página web?", en: "How much does a website cost?" },
        a: {
          es: "Depende del alcance: número de secciones, idiomas, integraciones y si lleva panel de administración. Cotizamos por proyecto, con alcance y tiempos por escrito.",
          en: "It depends on scope: number of sections, languages, integrations and whether it includes an admin panel. We quote per project, with scope and timeline in writing.",
        },
      },
      {
        q: { es: "¿Cuánto tarda en estar lista?", en: "How long does it take?" },
        a: {
          es: "Un sitio informativo suele estar listo en semanas, no meses. El tiempo exacto depende de qué tan listos estén los textos y las fotos.",
          en: "An informational site is usually ready in weeks, not months. The exact time depends on how ready the copy and photos are.",
        },
      },
      {
        q: { es: "¿Podré actualizarla yo?", en: "Will I be able to update it myself?" },
        a: {
          es: "Sí, si incluye panel de administración: tu equipo edita textos, imágenes y publicaciones sin tocar código.",
          en: "Yes, if it includes an admin panel: your team edits copy, images and posts without touching code.",
        },
      },
      {
        q: { es: "¿Va a aparecer en Google?", en: "Will it show up on Google?" },
        a: {
          es: "La construimos con SEO técnico de base: metadatos, sitemap, datos estructurados y velocidad. El posicionamiento también depende del contenido y de tu competencia; te decimos qué esperar con honestidad.",
          en: "We build it with solid technical SEO: metadata, sitemap, structured data and speed. Rankings also depend on content and competition; we'll tell you honestly what to expect.",
        },
      },
    ],
    related: ["mantenimiento-web", "inteligencia-artificial", "sistemas-a-la-medida"],
  },
  {
    slug: "sistemas-a-la-medida",
    icon: "dashboard",
    name: { es: "Sistemas y paneles a la medida", en: "Custom systems & admin panels" },
    short: {
      es: "Tu operación en un solo lugar: usuarios, permisos y reportes.",
      en: "Your operations in one place: users, roles and reports.",
    },
    seoTitle: {
      es: "Sistemas a la medida y paneles administrativos en Sonora",
      en: "Custom software & admin panels in Sonora, Mexico",
    },
    seoDescription: {
      es: "Desarrollo de sistemas a la medida y paneles administrativos en Hermosillo, Sonora: usuarios, roles, reportes e integraciones. Arquitectura multi-cliente probada en producción.",
      en: "Custom systems and admin panels in Hermosillo, Sonora: users, roles, reports and integrations. Multi-tenant architecture proven in production.",
    },
    keywords: {
      es: ["sistemas a la medida Hermosillo", "software a la medida Sonora", "panel administrativo", "desarrollo de software"],
      en: ["custom software Sonora", "admin panel development", "software development Mexico"],
    },
    intro: {
      es: "Si tu operación corre entre hojas de Excel, correos y mensajes, un sistema a la medida la ordena: cada quien ve lo suyo, todo queda registrado y los reportes salen solos. Construimos plataformas con usuarios, roles y permisos, como la que opera catorce portales desde un solo panel.",
      en: "If your operations run on spreadsheets, emails and chat messages, a custom system brings order: everyone sees what's theirs, everything is logged and reports build themselves. We build platforms with users, roles and permissions — like the one that runs fourteen portals from a single panel.",
    },
    forWho: {
      es: "Empresas y equipos que ya tienen el proceso resuelto en papel y lo necesitan resuelto en software.",
      en: "Companies and teams that already solved the process on paper and need it solved in software.",
    },
    includes: {
      es: [
        "Paneles con usuarios, roles y permisos",
        "Catálogos, inventarios, expedientes y flujos de aprobación",
        "Reportes y exportación de datos",
        "Arquitectura multi-cliente con aislamiento verificado",
        "Integraciones con WhatsApp, correo y APIs",
        "Respaldos, monitoreo y bitácora de cambios",
      ],
      en: [
        "Panels with users, roles and permissions",
        "Catalogs, inventories, records and approval flows",
        "Reports and data export",
        "Multi-tenant architecture with verified isolation",
        "Integrations with WhatsApp, email and APIs",
        "Backups, monitoring and audit logs",
      ],
    },
    steps: [
      {
        title: { es: "Mapa del proceso", en: "Process map" },
        body: {
          es: "Entendemos cómo se hace hoy, quién participa y dónde se pierde el tiempo.",
          en: "We learn how it's done today, who's involved and where time gets lost.",
        },
      },
      {
        title: { es: "Primer módulo", en: "First module" },
        body: {
          es: "Arrancamos con lo que más duele y lo ponemos en manos de tu equipo pronto.",
          en: "We start with what hurts most and put it in your team's hands early.",
        },
      },
      {
        title: { es: "Piloto", en: "Pilot" },
        body: {
          es: "Se prueba con un grupo real antes de extenderlo a toda la operación.",
          en: "It's tested with a real group before rolling out to everyone.",
        },
      },
      {
        title: { es: "Crecimiento por fases", en: "Phased growth" },
        body: {
          es: "Cada módulo nuevo se suma sin romper lo que ya funciona.",
          en: "Each new module is added without breaking what already works.",
        },
      },
    ],
    stack: ["Next.js", "Node.js", "Express", "Prisma", "PostgreSQL", "Supabase", "Cloudinary"],
    faq: [
      {
        q: { es: "¿Por qué no seguir con Excel?", en: "Why not keep using spreadsheets?" },
        a: {
          es: "Excel funciona hasta que varias personas editan lo mismo, se necesitan permisos o alguien pregunta quién cambió qué. Ahí un sistema te ahorra errores y tiempo.",
          en: "Spreadsheets work until several people edit the same thing, you need permissions, or someone asks who changed what. That's when a system saves time and mistakes.",
        },
      },
      {
        q: { es: "¿Dónde se guardan mis datos?", en: "Where is my data stored?" },
        a: {
          es: "En bases de datos PostgreSQL administradas en la nube, con respaldos y acceso restringido por roles.",
          en: "In managed PostgreSQL databases in the cloud, with backups and role-based access.",
        },
      },
      {
        q: { es: "¿Puedo empezar pequeño?", en: "Can I start small?" },
        a: {
          es: "Sí. Recomendamos empezar con un módulo y crecer por fases: inviertes en lo que ya demostró valor.",
          en: "Yes. We recommend starting with one module and growing in phases: you invest in what has already proven its value.",
        },
      },
    ],
    related: ["aplicaciones", "consultoria-tecnologica", "mantenimiento-web"],
  },
  {
    slug: "aplicaciones",
    icon: "smartphone",
    name: { es: "Aplicaciones web y móviles", en: "Web & mobile apps" },
    short: {
      es: "Apps para tus clientes o tu equipo, en cualquier celular.",
      en: "Apps for your customers or your team, on any phone.",
    },
    seoTitle: {
      es: "Desarrollo de aplicaciones web y móviles en Hermosillo",
      en: "Web & mobile app development in Hermosillo, Sonora",
    },
    seoDescription: {
      es: "Desarrollo de apps en Hermosillo, Sonora: aplicaciones web instalables (PWA) y apps a la medida para clientes, equipos de campo y operación interna.",
      en: "App development in Hermosillo, Sonora: installable web apps (PWA) and custom apps for customers, field teams and internal operations.",
    },
    keywords: {
      es: ["desarrollo de apps Hermosillo", "aplicaciones móviles Sonora", "PWA", "app para empresa"],
      en: ["app development Sonora", "mobile apps Mexico", "PWA development"],
    },
    intro: {
      es: "Una buena app se siente simple porque alguien pensó mucho por ti. Construimos aplicaciones web instalables (PWA) que funcionan en iPhone y Android sin pasar por tiendas, y apps a la medida cuando el proyecto lo pide.",
      en: "A good app feels simple because someone did the hard thinking for you. We build installable web apps (PWA) that run on iPhone and Android without app stores, and custom apps when the project calls for it.",
    },
    forWho: {
      es: "Negocios que quieren un portal para sus clientes, equipos de campo que capturan información y operaciones que viven en el celular.",
      en: "Businesses that want a customer portal, field teams capturing data and operations that live on the phone.",
    },
    includes: {
      es: [
        "PWA: se instala en el celular y tolera mala señal",
        "Portales de clientes y apps para equipos de campo",
        "Integraciones (pagos, mapas, WhatsApp) según el proyecto",
        "Experiencia diseñada alrededor del uso real",
        "Backend y API propios, listos para crecer",
        "Publicación, monitoreo y mantenimiento",
      ],
      en: [
        "PWA: installs on the phone and tolerates poor signal",
        "Customer portals and field-team apps",
        "Integrations (payments, maps, WhatsApp) as needed",
        "Experience designed around real usage",
        "Your own backend and API, ready to grow",
        "Release, monitoring and maintenance",
      ],
    },
    steps: [
      {
        title: { es: "Casos de uso", en: "Use cases" },
        body: {
          es: "Quién la usa, dónde y para qué — antes de dibujar una sola pantalla.",
          en: "Who uses it, where and for what — before drawing a single screen.",
        },
      },
      {
        title: { es: "Prototipo", en: "Prototype" },
        body: {
          es: "Flujos navegables para probar con usuarios reales.",
          en: "Clickable flows to test with real users.",
        },
      },
      {
        title: { es: "Desarrollo", en: "Build" },
        body: {
          es: "Entregas cortas, instalables en tu celular desde la primera semana de desarrollo.",
          en: "Short iterations you can install on your phone from the first week of development.",
        },
      },
      {
        title: { es: "Operación", en: "Operation" },
        body: {
          es: "Publicación, métricas de uso y mejoras continuas.",
          en: "Release, usage metrics and continuous improvement.",
        },
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "PWA", "Node.js", "PostgreSQL"],
    faq: [
      {
        q: { es: "¿PWA o app de tienda?", en: "PWA or app-store app?" },
        a: {
          es: "Una PWA se instala desde el navegador, se actualiza sola y cuesta menos de mantener. Si necesitas funciones del teléfono que solo dan las tiendas, te lo decimos desde el diagnóstico.",
          en: "A PWA installs from the browser, updates itself and costs less to maintain. If you need phone features only store apps provide, we'll tell you during discovery.",
        },
      },
      {
        q: { es: "¿Funciona en iPhone y Android?", en: "Does it work on iPhone and Android?" },
        a: {
          es: "Sí. Probamos cada entrega en celulares reales antes de publicarla.",
          en: "Yes. We test every release on real phones before publishing it.",
        },
      },
      {
        q: { es: "¿Funciona sin internet?", en: "Does it work offline?" },
        a: {
          es: "Una PWA puede guardar pantallas y datos para seguir funcionando con mala señal; cuánto depende de lo que la app necesite sincronizar.",
          en: "A PWA can cache screens and data to keep working on poor signal; how much depends on what the app needs to sync.",
        },
      },
    ],
    related: ["sistemas-a-la-medida", "inteligencia-artificial", "desarrollo-web"],
  },
  {
    slug: "inteligencia-artificial",
    icon: "sparkles",
    name: { es: "Chatbots e inteligencia artificial", en: "Chatbots & AI" },
    short: {
      es: "Asistentes 24/7, WhatsApp y automatización con tus datos.",
      en: "24/7 assistants, WhatsApp and automation with your data.",
    },
    seoTitle: {
      es: "Chatbots con IA y automatización para empresas en Sonora",
      en: "AI chatbots & automation for businesses in Sonora, Mexico",
    },
    seoDescription: {
      es: "Chatbots con inteligencia artificial para tu sitio y WhatsApp, búsqueda en documentos y automatización de procesos, con reglas claras y escalamiento a una persona.",
      en: "AI chatbots for your website and WhatsApp, document search and process automation, with clear rules and handoff to a human.",
    },
    keywords: {
      es: ["chatbot con IA", "chatbot WhatsApp empresa", "automatización con inteligencia artificial", "IA para negocios Sonora"],
      en: ["AI chatbot", "WhatsApp chatbot business", "AI automation Mexico"],
    },
    intro: {
      es: "La IA útil no es un truco: es un asistente que responde con la información real de tu negocio, un proceso que deja de hacerse dos veces, un documento largo que se entiende en segundos. Nort, el asistente de este sitio, es un ejemplo en vivo.",
      en: "Useful AI isn't a gimmick: it's an assistant that answers with your business's real information, a process that stops being done twice, a long document you understand in seconds. Nort, this site's assistant, is a live example.",
    },
    forWho: {
      es: "Equipos que responden las mismas preguntas todos los días, que capturan datos a mano o que se ahogan en documentos.",
      en: "Teams that answer the same questions every day, capture data by hand or drown in documents.",
    },
    includes: {
      es: [
        "Asistentes 24/7 en tu sitio y en WhatsApp",
        "Búsqueda que entiende preguntas en lenguaje natural",
        "Resúmenes y clasificación de documentos",
        "Redacción asistida en el tono de tu marca",
        "Agentes que automatizan capturas, respuestas y seguimiento",
        "Escalamiento a una persona cuando hace falta",
      ],
      en: [
        "24/7 assistants on your site and on WhatsApp",
        "Search that understands natural-language questions",
        "Document summaries and classification",
        "Assisted writing in your brand's voice",
        "Agents that automate data entry, replies and follow-up",
        "Handoff to a person when needed",
      ],
    },
    steps: [
      {
        title: { es: "Caso de uso", en: "Use case" },
        body: {
          es: "Elegimos una tarea concreta y cómo mediremos que mejoró.",
          en: "We pick one concrete task and how we'll measure the improvement.",
        },
      },
      {
        title: { es: "Datos y reglas", en: "Data & rules" },
        body: {
          es: "Qué información puede usar la IA, qué no, y cuándo debe pasarle la conversación a una persona.",
          en: "What information the AI may use, what it may not, and when to hand over to a person.",
        },
      },
      {
        title: { es: "Piloto", en: "Pilot" },
        body: {
          es: "Se prueba con conversaciones reales y se ajusta antes de abrirlo a todos.",
          en: "It's tested on real conversations and tuned before opening it to everyone.",
        },
      },
      {
        title: { es: "Operación", en: "Operation" },
        body: {
          es: "Monitoreo de calidad, costos de uso y mejoras continuas.",
          en: "Quality monitoring, usage costs and continuous improvement.",
        },
      },
    ],
    stack: ["AI SDK", "Claude", "OpenAI", "Next.js", "WhatsApp Business", "PostgreSQL"],
    faq: [
      {
        q: { es: "¿La IA puede inventar respuestas?", en: "Can the AI make things up?" },
        a: {
          es: "Puede equivocarse. Por eso la limitamos a tu información, le damos reglas claras y la configuramos para pasar la conversación a una persona cuando no está segura.",
          en: "It can make mistakes. That's why we limit it to your information, give it clear rules and set it up to hand the conversation to a person when it's unsure.",
        },
      },
      {
        q: { es: "¿Qué pasa con la información de mis clientes?", en: "What happens to my customers' data?" },
        a: {
          es: "Definimos contigo qué datos puede usar el asistente y cuáles no; la información sensible se queda fuera del alcance de la IA.",
          en: "We decide with you which data the assistant may use and which it may not; sensitive information stays out of the AI's reach.",
        },
      },
      {
        q: { es: "¿Cuánto cuesta operarla?", en: "How much does it cost to run?" },
        a: {
          es: "Además del desarrollo, la IA tiene un costo por uso que depende del volumen de conversaciones. Te lo estimamos antes de empezar.",
          en: "Besides development, AI has a usage cost that depends on conversation volume. We estimate it before starting.",
        },
      },
    ],
    related: ["desarrollo-web", "sistemas-a-la-medida", "consultoria-tecnologica"],
  },
  {
    slug: "mantenimiento-web",
    icon: "wrench",
    name: { es: "Mantenimiento web mensual", en: "Monthly website care" },
    short: {
      es: "Monitoreo, respaldos, actualizaciones y mejoras cada mes.",
      en: "Monitoring, backups, updates and improvements every month.",
    },
    seoTitle: {
      es: "Mantenimiento de páginas web y soporte mensual en Hermosillo",
      en: "Website maintenance & monthly support in Hermosillo, Sonora",
    },
    seoDescription: {
      es: "Mantenimiento web mensual en Hermosillo, Sonora: monitoreo, respaldos, actualizaciones de seguridad, cambios de contenido y mejoras continuas.",
      en: "Monthly website maintenance in Hermosillo, Sonora: monitoring, backups, security updates, content changes and continuous improvements.",
    },
    keywords: {
      es: ["mantenimiento de páginas web", "soporte web mensual", "mantenimiento web Hermosillo"],
      en: ["website maintenance", "monthly web support", "website care plan"],
    },
    intro: {
      es: "El mantenimiento aburrido es el que decide si un sistema dura tres años o tres meses. Nos hacemos cargo de que tu sitio siga rápido, seguro y al día, y de las mejoras que vayas necesitando.",
      en: "The boring maintenance is what decides whether a system lasts three years or three months. We keep your site fast, secure and up to date, plus the improvements you need along the way.",
    },
    forWho: {
      es: "Quien ya tiene sitio o sistema en línea y no quiere enterarse de los problemas por sus clientes.",
      en: "Anyone with a site or system online who doesn't want to hear about problems from their customers.",
    },
    includes: {
      es: [
        "Monitoreo de disponibilidad y rendimiento",
        "Respaldos y plan de recuperación",
        "Actualizaciones de seguridad y dependencias",
        "Cambios de contenido y mejoras menores",
        "Bitácora de lo que se hizo cada mes",
        "Soporte por WhatsApp y correo",
      ],
      en: [
        "Uptime and performance monitoring",
        "Backups and recovery plan",
        "Security and dependency updates",
        "Content changes and small improvements",
        "A log of what was done each month",
        "Support via WhatsApp and email",
      ],
    },
    steps: [
      {
        title: { es: "Diagnóstico", en: "Assessment" },
        body: {
          es: "Revisamos código, hosting, dominio y accesos antes de comprometernos.",
          en: "We review code, hosting, domain and access before committing.",
        },
      },
      {
        title: { es: "Puesta al día", en: "Catch-up" },
        body: {
          es: "Actualizaciones pendientes, respaldos y monitoreo activo.",
          en: "Pending updates, backups and active monitoring.",
        },
      },
      {
        title: { es: "Rutina mensual", en: "Monthly routine" },
        body: {
          es: "Revisión, cambios solicitados y registro de todo lo que se tocó.",
          en: "Review, requested changes and a record of everything touched.",
        },
      },
    ],
    stack: ["Vercel", "Render", "Cloudflare", "Supabase", "GitHub Actions"],
    faq: [
      {
        q: { es: "¿Pueden mantener un sitio que no hicieron ustedes?", en: "Can you maintain a site you didn't build?" },
        a: {
          es: "Sí, después de un diagnóstico: revisamos código, hosting y accesos antes de comprometernos.",
          en: "Yes, after an assessment: we review code, hosting and access before committing.",
        },
      },
      {
        q: { es: "¿Qué pasa si mi sitio se cae?", en: "What if my site goes down?" },
        a: {
          es: "El monitoreo nos avisa y atendemos el incidente con la prioridad que acordemos en tu plan.",
          en: "Monitoring alerts us and we handle the incident with the priority agreed in your plan.",
        },
      },
    ],
    related: ["desarrollo-web", "consultoria-tecnologica", "sistemas-a-la-medida"],
  },
  {
    slug: "consultoria-tecnologica",
    icon: "compass",
    name: { es: "Consultoría tecnológica", en: "Technology consulting" },
    short: {
      es: "Decisiones técnicas claras antes de invertir.",
      en: "Clear technical decisions before you invest.",
    },
    seoTitle: {
      es: "Consultoría tecnológica y transformación digital en Sonora",
      en: "Technology consulting & digital transformation in Sonora, Mexico",
    },
    seoDescription: {
      es: "Consultoría tecnológica en Hermosillo, Sonora: diagnóstico de sitios y sistemas, arquitectura, auditorías de rendimiento y seguridad, y planes de migración por fases.",
      en: "Technology consulting in Hermosillo, Sonora: assessment of websites and systems, architecture, performance and security audits, and phased migration plans.",
    },
    keywords: {
      es: ["consultoría tecnológica Sonora", "transformación digital Hermosillo", "auditoría web"],
      en: ["technology consulting Mexico", "digital transformation Sonora", "web audit"],
    },
    intro: {
      es: "Antes de invertir en software conviene saber qué construir, con qué y en qué orden. Te ayudamos a diagnosticar lo que tienes, elegir la tecnología correcta y planear una migración sin sustos.",
      en: "Before investing in software, it pays to know what to build, with what, and in which order. We help you assess what you have, choose the right technology and plan a migration without surprises.",
    },
    forWho: {
      es: "Organizaciones que van a invertir en tecnología y quieren una opinión técnica independiente.",
      en: "Organizations about to invest in technology that want an independent technical opinion.",
    },
    includes: {
      es: [
        "Diagnóstico de sitios y sistemas existentes",
        "Arquitectura y elección de tecnología",
        "Auditoría de rendimiento, seguridad y accesibilidad",
        "Plan de migración por fases",
        "Acompañamiento a tu equipo o proveedor",
        "Documentación y transferencia de conocimiento",
      ],
      en: [
        "Assessment of existing sites and systems",
        "Architecture and technology selection",
        "Performance, security and accessibility audits",
        "Phased migration plan",
        "Support for your team or vendor",
        "Documentation and knowledge transfer",
      ],
    },
    steps: [
      {
        title: { es: "Entrevistas", en: "Interviews" },
        body: {
          es: "Hablamos con quienes usan y mantienen lo que hoy existe.",
          en: "We talk to the people who use and maintain what exists today.",
        },
      },
      {
        title: { es: "Revisión técnica", en: "Technical review" },
        body: {
          es: "Código, infraestructura, costos y riesgos, medidos sobre lo que está en producción.",
          en: "Code, infrastructure, costs and risks, measured on what's in production.",
        },
      },
      {
        title: { es: "Plan priorizado", en: "Prioritized plan" },
        body: {
          es: "Hallazgos, riesgos y una ruta por fases con lo primero que conviene hacer.",
          en: "Findings, risks and a phased roadmap with what to do first.",
        },
      },
    ],
    stack: ["Next.js", "PostgreSQL", "Vercel", "Cloudflare", "Lighthouse", "WCAG 2.2"],
    faq: [
      {
        q: { es: "¿Sirve si ya tengo proveedor?", en: "Is it useful if I already have a vendor?" },
        a: {
          es: "Sí. A veces lo más útil es una segunda opinión independiente antes de firmar o de migrar.",
          en: "Yes. Sometimes the most useful thing is an independent second opinion before signing or migrating.",
        },
      },
      {
        q: { es: "¿Qué entregan al final?", en: "What do you deliver?" },
        a: {
          es: "Un documento con hallazgos, riesgos y un plan priorizado, explicado en una sesión con tu equipo.",
          en: "A document with findings, risks and a prioritized plan, walked through in a session with your team.",
        },
      },
    ],
    related: ["sistemas-a-la-medida", "mantenimiento-web", "desarrollo-web"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
