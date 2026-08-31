import { cn } from "@/lib/cn";
import { GlowBadge } from "./GlowBadge";
import { Reveal } from "./Reveal";

/**
 * Encabezado de sección estándar: eyebrow + título (h2) + descripción.
 * El `titleId` debe coincidir con el `labelledBy` de la Section.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = "center",
  className,
}) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center mx-auto";
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-5",
        alignment,
        className,
      )}
    >
      {eyebrow ? <GlowBadge>{eyebrow}</GlowBadge> : null}
      <h2
        id={titleId}
        className="text-[length:var(--text-h2)] font-semibold"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-[length:var(--text-lead)] text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export default SectionHeader;
