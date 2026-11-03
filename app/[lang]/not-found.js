"use client";

import { Button } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/StarIcon";
import { useUi } from "@/components/i18n/LocaleProvider";
import { rutaInicio } from "@/lib/i18n/config";

// Se muestra dentro del layout del idioma, así que el idioma sale del contexto.
export default function NotFound() {
  const { locale, ui } = useUi();
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <StarIcon className="h-14 w-14 [filter:drop-shadow(0_0_24px_rgba(127,211,255,0.5))]" />
      <h1 className="text-[length:var(--text-h2)]">{ui.notFound.titulo}</h1>
      <p className="m-0 max-w-md text-text-2">{ui.notFound.texto}</p>
      <Button href={rutaInicio(locale)}>{ui.notFound.volver}</Button>
    </section>
  );
}
