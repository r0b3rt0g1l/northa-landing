import type { L } from "@/lib/l10n";

/** "Cómo trabajamos" — las cuatro reglas de northa-landing/README.md, generalizadas para cualquier cliente. */
export const principles: { title: L; body: L }[] = [
  {
    title: { es: "Nada se inventa.", en: "Nothing is made up." },
    body: {
      es: "Un dato lleva fuente verificable o el campo se queda vacío. Aplica a textos, cifras, fotos y redes. Un sitio que publica un dato falso hace más daño que uno incompleto.",
      en: "Every fact carries a verifiable source or the field stays empty. It applies to copy, numbers, photos and social links. A site that publishes a false fact does more harm than an incomplete one.",
    },
  },
  {
    title: { es: "Se verifica sobre lo publicado.", en: "We verify what's live." },
    body: {
      es: "No sobre el código ni sobre la prueba en verde: sobre la URL exacta donde tu cliente vería el problema. Verde en una capa no dice nada de las otras.",
      en: "Not on the code, not on a green test suite: on the exact URL where your customer would see the problem. Green in one layer says nothing about the others.",
    },
  },
  {
    title: { es: "Un piloto antes de escalar.", en: "A pilot before scaling." },
    body: {
      es: "Lo que se va a repetir en muchos lugares se hace bien una vez, se verifica completo, y hasta entonces se replica.",
      en: "Whatever will be repeated in many places is done right once, fully verified, and only then replicated.",
    },
  },
  {
    title: { es: "Aprobación explícita en lo compartido.", en: "Explicit approval on shared systems." },
    body: {
      es: "Todo lo que toca datos con varios clientes encima se muestra antes de ejecutarse. Nunca un «no vuelvas a preguntar».",
      en: "Anything that touches data shared by several clients is shown before it runs. Never a “don't ask again”.",
    },
  },
];
