import type { L, LList } from "@/lib/l10n";

/**
 * Servicios de Northa (lista confirmada por Roberto el 30-sep-2026).
 * Poco texto a propósito: un nombre, una línea y cuatro puntos por servicio.
 * Cada uno tiene su página breve en /servicios/[slug] para Google.
 *
 * Regla de la casa: nada se inventa. Sin precios, plazos ni cifras.
 */

export type ServiceSlug =
  | "paginas-web"
  | "desarrollo-web"
  | "aplicaciones"
  | "portales-administradores"
  | "chatbots-ia"
  | "inteligencia-artificial"
  | "digitalizacion"
  | "seguridad-vpn"
  | "mantenimiento-web"
  | "capacitaciones";

export type ServiceIcon =
  | "globe"
  | "code"
  | "smartphone"
  | "dashboard"
  | "bot"
  | "sparkles"
  | "scan"
  | "shield"
  | "wrench"
  | "graduation";

export type ServiceGroup = "web" | "ai" | "ops";

export interface Service {
  slug: ServiceSlug;
  icon: ServiceIcon;
  group: ServiceGroup;
  /** Nombre corto: menú, lista del inicio y H1. */
  name: L;
  /** Una línea. */
  short: L;
  /** <title> con la búsqueda local. */
  seoTitle: L;
  seoDescription: L;
  keywords: LList;
  /** Cuatro puntos, pocas palabras cada uno. */
  includes: LList;
  related: ServiceSlug[];
}

export const serviceGroups: { key: ServiceGroup; name: L }[] = [
  { key: "web", name: { es: "Web y apps", en: "Web & apps" } },
  { key: "ai", name: { es: "Inteligencia artificial", en: "Artificial intelligence" } },
  { key: "ops", name: { es: "Operación y soporte", en: "Operations & support" } },
];

export const services: Service[] = [
  {
    slug: "paginas-web",
    icon: "globe",
    group: "web",
    name: { es: "Páginas web", en: "Websites" },
    short: { es: "Sitios rápidos que aparecen en Google.", en: "Fast websites that show up on Google." },
    seoTitle: { es: "Páginas web en Hermosillo, Sonora", en: "Websites in Hermosillo, Sonora" },
    seoDescription: {
      es: "Páginas web profesionales en Hermosillo, Sonora: rápidas, pensadas para el celular y listas para aparecer en Google. Escríbenos por WhatsApp.",
      en: "Professional websites in Hermosillo, Sonora: fast, mobile first and ready to show up on Google. Message us on WhatsApp.",
    },
    keywords: {
      es: ["páginas web Hermosillo", "diseño web Hermosillo", "página web para negocio Sonora"],
      en: ["websites Hermosillo", "web design Sonora", "business website Mexico"],
    },
    includes: {
      es: ["Diseño a la medida, primero para celular", "Lista para aparecer en Google", "WhatsApp y formularios de contacto", "Dominio, SSL y hosting"],
      en: ["Custom design, mobile first", "Ready to show up on Google", "WhatsApp and contact forms", "Domain, SSL and hosting"],
    },
    related: ["mantenimiento-web", "portales-administradores"],
  },
  {
    slug: "desarrollo-web",
    icon: "code",
    group: "web",
    name: { es: "Desarrollo web", en: "Web development" },
    short: { es: "Plataformas y sistemas web a la medida.", en: "Custom web platforms and systems." },
    seoTitle: { es: "Desarrollo web a la medida en Hermosillo", en: "Custom web development in Hermosillo, Sonora" },
    seoDescription: {
      es: "Desarrollo web a la medida en Hermosillo, Sonora: plataformas y sistemas web rápidos, seguros y hechos para tu operación.",
      en: "Custom web development in Hermosillo, Sonora: fast, secure web platforms and systems built around your operation.",
    },
    keywords: {
      es: ["desarrollo web Hermosillo", "sistemas web a la medida", "software a la medida Sonora"],
      en: ["web development Hermosillo", "custom web systems", "custom software Sonora"],
    },
    includes: {
      es: ["Sistemas hechos para tu operación", "Usuarios, roles y permisos", "Conexión con tus herramientas", "Listo para crecer contigo"],
      en: ["Systems built for your operation", "Users, roles and permissions", "Connected to your tools", "Ready to grow with you"],
    },
    related: ["portales-administradores", "digitalizacion"],
  },
  {
    slug: "aplicaciones",
    icon: "smartphone",
    group: "web",
    name: { es: "Aplicaciones", en: "Apps" },
    short: { es: "Apps web y móviles para tu negocio.", en: "Web and mobile apps for your business." },
    seoTitle: { es: "Desarrollo de aplicaciones en Hermosillo", en: "App development in Hermosillo, Sonora" },
    seoDescription: {
      es: "Aplicaciones web y móviles en Hermosillo, Sonora: apps instalables en iPhone y Android para tus clientes o tu equipo.",
      en: "Web and mobile apps in Hermosillo, Sonora: installable apps for iPhone and Android, for your customers or your team.",
    },
    keywords: {
      es: ["desarrollo de apps Hermosillo", "aplicaciones móviles Sonora", "app para empresa"],
      en: ["app development Sonora", "mobile apps Mexico", "business app"],
    },
    includes: {
      es: ["Se instalan en iPhone y Android", "Para tus clientes o tu equipo", "Conectadas a tu sistema", "Publicación y soporte"],
      en: ["Install on iPhone and Android", "For your customers or your team", "Connected to your system", "Release and support"],
    },
    related: ["desarrollo-web", "portales-administradores"],
  },
  {
    slug: "portales-administradores",
    icon: "dashboard",
    group: "web",
    name: { es: "Portales administradores", en: "Admin portals" },
    short: { es: "Paneles para manejar tu negocio.", en: "Dashboards to run your business." },
    seoTitle: { es: "Portales y paneles administradores en Sonora", en: "Admin portals and dashboards in Sonora, Mexico" },
    seoDescription: {
      es: "Portales administradores a la medida en Sonora: tu equipo publica, consulta y controla su información sin depender de nadie.",
      en: "Custom admin portals in Sonora, Mexico: your team publishes, reviews and controls its information on its own.",
    },
    keywords: {
      es: ["panel administrador a la medida", "portal administrativo Sonora", "sistema de administración"],
      en: ["custom admin panel", "admin portal Mexico", "management dashboard"],
    },
    includes: {
      es: ["Tu equipo publica sin programar", "Usuarios con roles y permisos", "Documentos y reportes en un lugar", "Acceso seguro desde cualquier lado"],
      en: ["Your team publishes without code", "Users with roles and permissions", "Documents and reports in one place", "Secure access from anywhere"],
    },
    related: ["desarrollo-web", "paginas-web"],
  },
  {
    slug: "chatbots-ia",
    icon: "bot",
    group: "ai",
    name: { es: "Chatbots con IA", en: "AI chatbots" },
    short: { es: "Asistentes que atienden 24/7.", en: "Assistants that answer 24/7." },
    seoTitle: { es: "Chatbots con inteligencia artificial en Hermosillo", en: "AI chatbots in Hermosillo, Sonora" },
    seoDescription: {
      es: "Chatbots con inteligencia artificial en Hermosillo, Sonora: responden con la información de tu negocio y te pasan cada prospecto.",
      en: "AI chatbots in Hermosillo, Sonora: they answer with your business information and hand every lead over to you.",
    },
    keywords: {
      es: ["chatbot con IA Hermosillo", "chatbot para negocio", "asistente virtual Sonora"],
      en: ["AI chatbot Hermosillo", "business chatbot", "virtual assistant Sonora"],
    },
    includes: {
      es: ["Responde con la información de tu negocio", "Atiende a toda hora", "Te pasa el cliente por WhatsApp", "Guarda cada prospecto"],
      en: ["Answers with your business information", "Available around the clock", "Hands customers over on WhatsApp", "Saves every lead"],
    },
    related: ["inteligencia-artificial", "paginas-web"],
  },
  {
    slug: "inteligencia-artificial",
    icon: "sparkles",
    group: "ai",
    name: { es: "Soluciones con IA", en: "AI solutions" },
    short: { es: "Automatiza y analiza con IA.", en: "Automate and analyze with AI." },
    seoTitle: { es: "Soluciones con inteligencia artificial para empresas en Sonora", en: "AI solutions for businesses in Sonora, Mexico" },
    seoDescription: {
      es: "Soluciones con inteligencia artificial en Sonora: automatización de tareas, análisis de documentos e IA conectada a tus sistemas.",
      en: "AI solutions in Sonora, Mexico: task automation, document analysis and AI connected to your systems.",
    },
    keywords: {
      es: ["inteligencia artificial para empresas", "automatización con IA Sonora", "IA Hermosillo"],
      en: ["AI for business", "AI automation Mexico", "AI Hermosillo"],
    },
    includes: {
      es: ["Automatiza tareas repetitivas", "Resume y analiza documentos", "Clasifica datos y correos", "IA conectada a tus sistemas"],
      en: ["Automates repetitive tasks", "Summarizes and analyzes documents", "Sorts data and email", "AI connected to your systems"],
    },
    related: ["chatbots-ia", "digitalizacion"],
  },
  {
    slug: "digitalizacion",
    icon: "scan",
    group: "ops",
    name: { es: "Digitalización", en: "Digitization" },
    short: { es: "Del papel y el Excel a un sistema.", en: "From paper and spreadsheets to a system." },
    seoTitle: { es: "Digitalización de procesos en Hermosillo", en: "Process digitization in Hermosillo, Sonora" },
    seoDescription: {
      es: "Digitalización en Hermosillo, Sonora: pasamos tus procesos en papel y hojas de cálculo a un sistema fácil de usar.",
      en: "Digitization in Hermosillo, Sonora: we move your paper and spreadsheet processes into an easy-to-use system.",
    },
    keywords: {
      es: ["digitalización de procesos", "digitalizar documentos Hermosillo", "de Excel a sistema"],
      en: ["process digitization", "document digitization Mexico", "spreadsheet to system"],
    },
    includes: {
      es: ["Formatos en papel a formularios", "Archivos escaneados y ordenados", "Del Excel a una base de datos", "Aprobaciones en línea"],
      en: ["Paper forms to online forms", "Scanned, organized files", "From spreadsheets to a database", "Online approvals"],
    },
    related: ["desarrollo-web", "inteligencia-artificial"],
  },
  {
    slug: "seguridad-vpn",
    icon: "shield",
    group: "ops",
    name: { es: "Seguridad y VPN", en: "Security & VPN" },
    short: { es: "Accesos remotos seguros para tu equipo.", en: "Secure remote access for your team." },
    seoTitle: { es: "Seguridad informática y VPN en Hermosillo", en: "IT security and VPN in Hermosillo, Sonora" },
    seoDescription: {
      es: "Seguridad y VPN en Hermosillo, Sonora: conexiones cifradas para que tu equipo trabaje desde donde sea sin exponer tu información.",
      en: "Security and VPN in Hermosillo, Sonora: encrypted connections so your team works from anywhere without exposing your data.",
    },
    keywords: {
      es: ["VPN para empresas Hermosillo", "seguridad informática Sonora", "acceso remoto seguro"],
      en: ["business VPN Mexico", "IT security Sonora", "secure remote access"],
    },
    includes: {
      es: ["VPN para oficinas y equipos", "Conexiones cifradas", "Accesos por usuario", "Revisión de tu red"],
      en: ["VPN for offices and teams", "Encrypted connections", "Per-user access", "Network review"],
    },
    related: ["mantenimiento-web", "capacitaciones"],
  },
  {
    slug: "mantenimiento-web",
    icon: "wrench",
    group: "ops",
    name: { es: "Mantenimiento web", en: "Website maintenance" },
    short: { es: "Tu sitio al día, seguro y respaldado.", en: "Your site updated, secure, backed up." },
    seoTitle: { es: "Mantenimiento de páginas web en Hermosillo", en: "Website maintenance in Hermosillo, Sonora" },
    seoDescription: {
      es: "Mantenimiento de páginas web en Hermosillo, Sonora: actualizaciones, respaldos, monitoreo y cambios cuando los necesites.",
      en: "Website maintenance in Hermosillo, Sonora: updates, backups, monitoring and changes whenever you need them.",
    },
    keywords: {
      es: ["mantenimiento web Hermosillo", "soporte de página web", "actualizar página web"],
      en: ["website maintenance Hermosillo", "website support", "website updates"],
    },
    includes: {
      es: ["Actualizaciones y respaldos", "Monitoreo y correcciones", "Cambios de contenido", "Atención directa por WhatsApp"],
      en: ["Updates and backups", "Monitoring and fixes", "Content changes", "Direct support on WhatsApp"],
    },
    related: ["paginas-web", "seguridad-vpn"],
  },
  {
    slug: "capacitaciones",
    icon: "graduation",
    group: "ops",
    name: { es: "Capacitaciones", en: "Training" },
    short: { es: "Cursos prácticos para tu equipo.", en: "Hands-on training for your team." },
    seoTitle: { es: "Capacitación en tecnología e IA en Hermosillo", en: "Technology and AI training in Hermosillo, Sonora" },
    seoDescription: {
      es: "Capacitaciones en Hermosillo, Sonora: herramientas digitales, uso de inteligencia artificial y tu nuevo sistema, paso a paso.",
      en: "Training in Hermosillo, Sonora: digital tools, using artificial intelligence and your new system, step by step.",
    },
    keywords: {
      es: ["capacitación en IA Hermosillo", "curso herramientas digitales", "capacitación tecnológica Sonora"],
      en: ["AI training Hermosillo", "digital tools course", "technology training Sonora"],
    },
    includes: {
      es: ["Herramientas digitales de oficina", "Inteligencia artificial en el trabajo", "Tu nuevo sistema, paso a paso", "Presencial o en línea"],
      en: ["Digital office tools", "Artificial intelligence at work", "Your new system, step by step", "In person or online"],
    },
    related: ["inteligencia-artificial", "digitalizacion"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
