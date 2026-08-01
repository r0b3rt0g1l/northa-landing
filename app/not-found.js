import { Button } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/StarIcon";

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <StarIcon className="h-16 w-16 [filter:drop-shadow(0_0_30px_rgba(255,46,126,0.5))]" />
      <h1 className="text-[length:var(--text-h2)] font-semibold">
        Página no encontrada
      </h1>
      <p className="max-w-md text-[var(--color-muted)]">
        La página que buscas no existe o cambió de lugar.
      </p>
      <Button href="/">Volver al inicio</Button>
    </section>
  );
}
