import { cn } from "@/lib/cn";

/**
 * Envoltorio de sección con id de ancla, landmark accesible y contenedor.
 * Usar siempre `labelledBy` apuntando al id del <h2> de la sección.
 */
export function Section({
  id,
  labelledBy,
  className,
  containerClassName,
  children,
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative px-6 py-24 sm:py-28 lg:py-32", className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export default Section;
