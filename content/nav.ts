import type { Dictionary } from "@/lib/i18n/dictionaries/es";

type NavKey = keyof Dictionary["nav"];

/** Navegación principal. `path` es la ruta interna (sin idioma). */
export const primaryNav: { key: NavKey; path: string }[] = [
  { key: "services", path: "/servicios" },
  { key: "work", path: "/portfolio" },
  { key: "process", path: "/#proceso" },
  { key: "gov", path: "/gobierno" },
  { key: "blog", path: "/blog" },
  { key: "contact", path: "/contacto" },
];
