// Comparación "portal heredado" vs "portal Northa".
// Describe la CATEGORÍA del software heredado, sin nombrar a ningún competidor.
export const comparacion = {
  antes: {
    title: "Portal heredado",
    tagline: "Sistemas tipo CMS genérico de hace más de una década.",
    points: [
      "Carga lenta y pesada que cansa al ciudadano.",
      "Difícil de actualizar: dependes de terceros para cada cambio.",
      "Tecnología antigua y seguridad incierta.",
      "Poco o nada accesible para personas con discapacidad.",
      "Con rastreadores publicitarios de plataformas externas.",
    ],
  },
  ahora: {
    title: "Portal Northa",
    tagline: "Construido con la tecnología más reciente del desarrollo web.",
    points: [
      "Carga veloz, servida desde una red edge global.",
      "Tu propio equipo actualiza el contenido desde un panel en español.",
      "Cifrado, autenticación por tokens firmados y control de accesos por roles.",
      "Cumple criterios clave de WCAG 2.1: teclado, foco visible y lectores de pantalla.",
      "Sin rastreadores ni scripts publicitarios; analítica sin cookies personales.",
    ],
  },
};
