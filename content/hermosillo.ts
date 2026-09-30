import type { L } from "@/lib/l10n";

/**
 * Datos del Cerro de la Campana para la sección "Hecho en Hermosillo".
 * Cada dato lleva su fuente (regla: nada se inventa).
 *  - 319 m de altura: https://en.wikipedia.org/wiki/Cerro_de_la_Campana y
 *    https://sonorastar.com/2020/08/04/10-datos-historicos-sobre-el-cerro-de-la-campana/
 *  - Nombre (forma de campana y rocas que suenan al golpearse):
 *    https://noro.mx/hermosillo/por-que-el-cerro-de-la-campana-tiene-ese-nombre/
 *  - Camino circular a la cima (1964) y antenas (1968, Juegos Olímpicos México 68): Sonora Star, misma liga.
 */
export const cerroFacts: { value: string; label: L }[] = [
  {
    value: "319 m",
    label: { es: "sobre el nivel del mar en la cima", en: "above sea level at the summit" },
  },
  {
    value: "1964",
    label: { es: "se construye el camino circular a la cima", en: "the circular road to the summit is built" },
  },
  {
    value: "1968",
    label: {
      es: "se instalan antenas para transmitir México 68",
      en: "antennas installed to broadcast the Mexico 68 Olympics",
    },
  },
];

export const cerroNameFact: L = {
  es: "Su nombre viene de su silueta de campana y de sus rocas, que suenan como campana al golpearse.",
  en: "It's named for its bell-shaped silhouette and its rocks, which ring like a bell when struck.",
};
