// Planes mensuales sin montos: la venta a gobierno se cotiza por proyecto.
// Cada plan lleva máximo cuatro incluidos, una línea cada uno.
export const planes = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Presencia digital profesional.",
    features: [
      "Sitio institucional",
      "Dominio y certificado",
      "Hosting y respaldos",
      "Soporte por correo",
    ],
    cta: "Solicitar cotización",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Plataforma con panel administrativo.",
    features: [
      "Todo lo de Starter",
      "Panel de administración",
      "Transparencia y obligaciones",
      "Soporte prioritario",
    ],
    cta: "Solicitar cotización",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Operación completa con IA.",
    features: [
      "Todo lo de Pro",
      "Asistente ciudadano 24/7",
      "Automatización y WhatsApp",
      "Responsable dedicado",
    ],
    cta: "Solicitar cotización",
    featured: false,
  },
];
