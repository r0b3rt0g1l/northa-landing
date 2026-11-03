import {
  LayoutGrid,
  Globe,
  Share2,
  Camera,
  Video,
  PenTool,
  ShieldCheck,
  Sparkles,
  LayoutList,
  LockKeyhole,
  ClipboardCheck,
  Network,
  KeyRound,
  Activity,
  MessagesSquare,
  LayoutDashboard,
} from "lucide-react";
import { localizar, porIdioma } from "@/lib/i18n/localizar";

// Cada texto se escribe como { es, en }; getServicios(locale), getSeguridad(locale)
// y getBeneficios(locale) devuelven los datos ya en un solo idioma.

// Servicios descritos por lo que resuelven, nunca por cómo se implementan.
// El destacado lleva el texto y la nota de seguridad del brief, literales.
// `resumen` es la línea corta del menú de servicios.
const servicios = [
  {
    id: "portales-sistemas",
    destacado: true,
    Icon: LayoutGrid,
    title: { es: "Portales y sistemas digitales", en: "Digital portals and systems" },
    resumen: {
      es: "Información, procesos y comunicación en un solo lugar.",
      en: "Information, processes and communication in one place.",
    },
    description: {
      es: "Portales y herramientas digitales para centralizar información, facilitar procesos, mejorar la comunicación y administrar accesos de forma responsable.",
      en: "Portals and digital tools to centralize information, streamline processes, improve communication and manage access responsibly.",
    },
    nota: {
      es: "Los sistemas se planean considerando buenas prácticas de seguridad, control de acceso y protección de información.",
      en: "Systems are planned with good security practices, access control and information protection in mind.",
    },
  },
  {
    id: "desarrollo-web",
    Icon: Globe,
    title: { es: "Desarrollo web", en: "Web development" },
    resumen: {
      es: "Sitios claros y rápidos en cualquier pantalla.",
      en: "Clear, fast sites on any screen.",
    },
    description: {
      es: "Sitios claros y rápidos que se ven bien en cualquier pantalla.",
      en: "Clear, fast sites that look great on any screen.",
    },
  },
  {
    id: "redes-sociales",
    Icon: Share2,
    title: { es: "Redes sociales", en: "Social media" },
    resumen: {
      es: "Estrategia, calendario y voz constante.",
      en: "Strategy, calendar and a consistent voice.",
    },
    description: {
      es: "Estrategia, calendario y publicaciones con una voz constante.",
      en: "Strategy, calendar and posts with a consistent voice.",
    },
  },
  {
    id: "fotografia",
    Icon: Camera,
    title: { es: "Fotografía", en: "Photography" },
    resumen: {
      es: "Institucional, de producto y de espacios.",
      en: "Institutional, product and space photography.",
    },
    description: {
      es: "Fotografía institucional, de producto y de espacios.",
      en: "Institutional, product and space photography.",
    },
  },
  {
    id: "video",
    Icon: Video,
    title: { es: "Video", en: "Video" },
    resumen: {
      es: "Piezas breves para presentar y comunicar.",
      en: "Short pieces to present and communicate.",
    },
    description: {
      es: "Piezas breves para presentar servicios, proyectos y mensajes.",
      en: "Short pieces to present services, projects and messages.",
    },
  },
  {
    id: "diseno-grafico",
    Icon: PenTool,
    title: { es: "Diseño gráfico", en: "Graphic design" },
    resumen: {
      es: "Identidad, piezas editoriales y campañas.",
      en: "Identity, editorial pieces and campaigns.",
    },
    description: {
      es: "Identidad visual, piezas editoriales y material para campañas.",
      en: "Visual identity, editorial pieces and campaign material.",
    },
  },
];

// Seguridad: se comunica de forma simple. Los cuatro puntos nombran lo que el
// visitante entiende (VPN, login, control de acceso) sin herramientas,
// configuraciones, direcciones, paneles reales ni procedimientos. La única
// excepción, pedida por el cliente, es `acceso`: capturas reales rotuladas
// como tales y redactadas según el README («Capturas del acceso»).
const seguridad = {
  id: "seguridad",
  Icon: ShieldCheck,
  title: { es: "Seguridad y acceso protegido", en: "Security and protected access" },
  titular: { es: "Plataformas protegidas.", en: "Protected platforms." },
  resumen: {
    es: "Protección moderna y control de acceso para tus plataformas administrativas.",
    en: "Modern protection and access control for your administrative platforms.",
  },
  description: {
    es: "Implementamos medidas modernas de protección y control de acceso para las plataformas administrativas que construimos.",
    en: "We implement modern protection and access control measures for the administrative platforms we build.",
  },
  puntos: [
    {
      Icon: Network,
      titulo: { es: "Acceso protegido con VPN", en: "VPN-protected access" },
      texto: {
        es: "El panel se administra desde una conexión privada y cifrada.",
        en: "The panel is managed over a private, encrypted connection.",
      },
    },
    {
      Icon: KeyRound,
      titulo: { es: "Login administrativo seguro", en: "Secure admin login" },
      texto: {
        es: "Solo las personas autorizadas entran al panel.",
        en: "Only authorized people get into the panel.",
      },
    },
    {
      Icon: ShieldCheck,
      titulo: { es: "Protección para tus plataformas", en: "Protection for your platforms" },
      texto: {
        es: "La información de tu empresa, negocio o municipio, cuidada.",
        en: "The information of your company, business or municipality, safeguarded.",
      },
    },
    {
      Icon: Activity,
      titulo: { es: "Control de acceso y monitoreo", en: "Access control and monitoring" },
      texto: {
        es: "Quién entra y qué puede hacer, siempre a la vista.",
        en: "Who gets in and what they can do, always in view.",
      },
    },
  ],
  // Capturas reales del acceso al panel administrativo (CMS). Antes de
  // publicarlas se taparon el dominio privado de acceso y el código, y el
  // correo que se ve es el de Northa (public/seguridad/). Los alt describen
  // sin nombrar la aplicación ni la cuenta.
  acceso: {
    titulo: {
      es: "Así se entra a tu panel administrativo",
      en: "This is how you sign in to your admin panel",
    },
    texto: {
      es: "Tres pasos del acceso a nuestro CMS. Ocultamos los datos sensibles y mostramos el correo de Northa.",
      en: "Three steps of access to our CMS. We hide the sensitive data and show Northa's email.",
    },
    pasos: [
      {
        src: "/seguridad/acceso-correo-2.webp",
        width: 918,
        height: 333,
        titulo: { es: "Primero, el acceso privado", en: "First, private access" },
        texto: {
          es: "Antes de mostrar el panel, Cloudflare Access pide el correo de quien entra.",
          en: "Before showing the panel, Cloudflare Access asks for the email of the person signing in.",
        },
        alt: {
          es: "Captura del campo de correo de quien entra, con el botón para enviar el código.",
          en: "Screenshot of the email field for the person signing in, with the button to send the code.",
        },
      },
      {
        src: "/seguridad/acceso-codigo.webp",
        width: 910,
        height: 746,
        titulo: { es: "Código de un solo uso", en: "One-time code" },
        texto: {
          es: "Llega a ese correo y vence en 10 minutos.",
          en: "It arrives at that email and expires in 10 minutes.",
        },
        alt: {
          es: "Captura de la pantalla donde se escribe el código de un solo uso que llega por correo y vence en 10 minutos. El código está oculto.",
          en: "Screenshot of the screen where you enter the one-time code sent by email, which expires in 10 minutes. The code is hidden.",
        },
      },
      {
        src: "/seguridad/acceso-panel-2.webp",
        width: 854,
        height: 756,
        titulo: { es: "Después, el login del panel", en: "Then, the panel login" },
        texto: {
          es: "Correo, contraseña y una verificación anti-bots de Cloudflare.",
          en: "Email, password and a Cloudflare anti-bot check.",
        },
        alt: {
          es: "Captura del inicio de sesión del panel, con los campos de correo y contraseña vacíos y la verificación anti-bots de Cloudflare superada.",
          en: "Screenshot of the panel sign-in, with the email and password fields empty and the Cloudflare anti-bot check passed.",
        },
      },
    ],
  },
};

// Beneficios para el cliente, en pocas palabras. No prometen funciones,
// precios, plazos ni integraciones.
const beneficios = [
  {
    Icon: Sparkles,
    titulo: { es: "Presencia digital", en: "Digital presence" },
    texto: {
      es: "Tu organización, clara y profesional en internet.",
      en: "Your organization, clear and professional online.",
    },
  },
  {
    Icon: LayoutList,
    titulo: { es: "Información ordenada", en: "Organized information" },
    texto: { es: "Todo en su lugar y fácil de encontrar.", en: "Everything in its place and easy to find." },
  },
  {
    Icon: LockKeyhole,
    titulo: { es: "Seguridad", en: "Security" },
    texto: { es: "Acceso protegido y datos bajo control.", en: "Protected access and data under control." },
  },
  {
    Icon: ClipboardCheck,
    titulo: { es: "Trámites", en: "Procedures" },
    texto: { es: "Servicios y requisitos a la vista.", en: "Services and requirements at a glance." },
  },
  {
    Icon: MessagesSquare,
    titulo: { es: "Comunicación", en: "Communication" },
    texto: { es: "Mensajes claros para tu comunidad.", en: "Clear messages for your community." },
  },
  {
    Icon: LayoutDashboard,
    titulo: { es: "Administración", en: "Administration" },
    texto: { es: "Publica y actualiza por tu cuenta.", en: "Publish and update on your own." },
  },
];

export const getServicios = porIdioma((locale) => localizar(servicios, locale));
export const getSeguridad = porIdioma((locale) => localizar(seguridad, locale));
export const getBeneficios = porIdioma((locale) => localizar(beneficios, locale));
