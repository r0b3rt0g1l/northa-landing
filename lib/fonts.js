import { Bricolage_Grotesque, Karla, JetBrains_Mono } from "next/font/google";

// Titulares — geométrica, con carácter editorial.
export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

// Cuerpo / UI.
export const karla = Karla({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-karla",
  display: "swap",
});

// Labels técnicos — eyebrows, rumbos, contacto.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
