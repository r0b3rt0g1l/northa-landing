import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/**
 * Encabezado de sección minimalista: eyebrow en mono + título (h2) + una
 * línea opcional. El `titleId` debe coincidir con el `labelledBy` de la Section.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = "left",
  className,
}) {
  const alignment =
    align === "center"
      ? "items-center text-center mx-auto"
      : "items-start text-left";
  return (
    <Reveal className={cn("flex max-w-3xl flex-col gap-4", alignment, className)}>
      {eyebrow ? (
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.28em] text-[var(--color-bright)]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className="text-[length:var(--text-h2)] font-semibold tracking-[-0.03em]"
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-[52ch] text-[length:var(--text-body)] font-light text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export default SectionHeader;
