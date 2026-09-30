import type { L } from "@/lib/l10n";

/**
 * Cifras del home. Solo hechos verificables de la operación actual
 * (northa-landing/README.md: 14 portales, un backend y un panel compartidos,
 * aislamiento entre clientes verificado por suite automatizada).
 */
export const homeStats: { value: number; suffix?: string; label: L }[] = [
  { value: 14, label: { es: "sitios en producción", en: "sites in production" } },
  { value: 14, label: { es: "dominios propios operando", en: "own domains running" } },
  { value: 1, label: { es: "plataforma multi-cliente", en: "multi-tenant platform" } },
  { value: 0, label: { es: "cruces de datos entre clientes", en: "cross-client data leaks" } },
];

/** Stack real (northa-landing/lib/content/tech.js + perfil de Roberto). */
export const techStack: string[] = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
  "Node.js",
  "Express",
  "Prisma",
  "PostgreSQL",
  "Supabase",
  "Cloudinary",
  "Vercel",
  "Render",
  "Cloudflare",
  "AI SDK",
  "Three.js",
  "GSAP",
];
