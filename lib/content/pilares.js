import { Gauge, Lock, Accessibility, EyeOff } from "lucide-react";

// Pilares de calidad — basados ESTRICTAMENTE en los claims aprobados.
// Las etiquetas (badge) son hechos defendibles, no métricas inventadas.
export const pilares = [
  {
    Icon: Gauge,
    title: "Rendimiento",
    badge: "AVIF · WebP",
    points: [
      "Imágenes en formatos modernos AVIF y WebP, optimizadas vía CDN global.",
      "Páginas pre-renderizadas servidas desde una red edge global.",
      "Tipografías profesionales self-hosted: cero peticiones a servidores externos al cargar.",
      "Medimos el rendimiento real (Core Web Vitals) de cada visita en producción.",
    ],
  },
  {
    Icon: Lock,
    title: "Seguridad",
    badge: "Tokens firmados",
    points: [
      "Contraseñas cifradas y autenticación basada en tokens firmados.",
      "Control de acceso por roles en cada operación sensible.",
      "Credenciales y datos sensibles jamás expuestos al navegador del ciudadano.",
    ],
  },
  {
    Icon: Accessibility,
    title: "Accesibilidad",
    badge: "WCAG 2.1",
    points: [
      "Navegación por teclado, foco visible y estructura semántica.",
      "Soporte de movimiento reducido para quien lo prefiere.",
      "Componentes construidos sobre librerías diseñadas alrededor del estándar WAI-ARIA.",
    ],
  },
  {
    Icon: EyeOff,
    title: "Privacidad",
    badge: "0 rastreadores",
    points: [
      "Sin Google Analytics, sin Facebook Pixel, sin scripts publicitarios.",
      "Analítica sin cookies personales.",
      "Los datos de los formularios llegan al correo institucional del municipio, no a bases de terceros.",
    ],
  },
];
