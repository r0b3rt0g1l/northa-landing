import { StarIcon } from "@/components/ui/StarIcon";
import { techStack, techCaption } from "@/lib/content/tech";

/**
 * Cinta infinita con el stack tecnológico. Animación 100% CSS (sin JS).
 * La lista se duplica: la copia es aria-hidden para no repetir en lectores.
 * prefers-reduced-motion congela la animación (regla global en globals.css).
 */
export function TechMarquee() {
  return (
    <section
      aria-label="Tecnologías que utilizamos"
      className="border-y border-[var(--color-line)] bg-[var(--color-surface)]/50 py-12"
    >
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="marquee-track flex w-max items-center">
          {[...techStack, ...techStack].map((tech, i) => (
            <li
              key={`${tech}-${i}`}
              aria-hidden={i >= techStack.length ? "true" : undefined}
              className="flex items-center gap-8 px-8"
            >
              <span className="font-display text-lg font-medium text-[var(--color-text)]/85 sm:text-xl">
                {tech}
              </span>
              <StarIcon className="h-2.5 w-2.5 text-[var(--color-bright)]/50" />
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-8 max-w-2xl px-6 text-center text-sm text-[var(--color-muted)]">
        {techCaption}
      </p>
    </section>
  );
}

export default TechMarquee;
