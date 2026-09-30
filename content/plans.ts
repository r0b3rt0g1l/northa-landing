import type { L, LList } from "@/lib/l10n";

/**
 * Planes. Sin montos: cada proyecto se cotiza por alcance (misma política que
 * northa-landing). Si algún día quieres mostrar "Desde $X", llena `priceFrom`
 * (en MXN, número entero) y la tarjeta lo muestra solo.
 *
 * Revisa los incluidos: se adaptaron de northa-landing para hablarle también a empresas.
 */
export interface Plan {
  id: "starter" | "pro" | "enterprise";
  name: string;
  tagline: L;
  features: LList;
  featured: boolean;
  /** MXN mensuales. `null` = "Cotización a la medida". */
  priceFrom: number | null;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: { es: "Presencia digital profesional.", en: "Professional digital presence." },
    features: {
      es: ["Sitio a la medida, celular primero", "Dominio, certificado y hosting", "Respaldos y monitoreo", "Soporte por WhatsApp y correo"],
      en: ["Custom site, mobile first", "Domain, certificate and hosting", "Backups and monitoring", "Support via WhatsApp and email"],
    },
    featured: false,
    priceFrom: null,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: { es: "Plataforma con panel administrativo.", en: "Platform with an admin panel." },
    features: {
      es: ["Todo lo de Starter", "Panel de administración con roles", "Integraciones (WhatsApp, formularios, CRM)", "Soporte prioritario"],
      en: ["Everything in Starter", "Admin panel with roles", "Integrations (WhatsApp, forms, CRM)", "Priority support"],
    },
    featured: true,
    priceFrom: null,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: { es: "Operación completa con IA.", en: "Full operation with AI." },
    features: {
      es: ["Todo lo de Pro", "Asistente con IA 24/7", "Automatización y WhatsApp", "Responsable dedicado"],
      en: ["Everything in Pro", "24/7 AI assistant", "Automation and WhatsApp", "Dedicated lead"],
    },
    featured: false,
    priceFrom: null,
  },
];
