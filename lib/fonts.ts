import { Bricolage_Grotesque, JetBrains_Mono, Karla } from "next/font/google";

/**
 * Tipografías de la marca (las mismas de northa-landing), self-hosted por next/font:
 * cero peticiones a Google desde el navegador del visitante.
 */

// Solo se precarga el subconjunto "latin": cubre español e inglés (á, ñ, ü, ¿, ¡…).
// Los demás subconjuntos siguen declarados y el navegador los baja solo si una
// página usa esos caracteres.

// Titulares — grotesca con carácter editorial. Variable con eje óptico.
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

// Cuerpo e interfaz.
export const karla = Karla({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-karla",
  display: "swap",
});

// Etiquetas técnicas: eyebrows, rumbos, datos. Solo se usa en peso normal, así
// que va la instancia fija de 400 (la mitad de bytes que la variable).
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const fontVariables = `${bricolage.variable} ${karla.variable} ${jetbrains.variable}`;
