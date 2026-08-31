import { cn } from "@/lib/cn";
import { StarIcon } from "./StarIcon";

/**
 * Eyebrow / píldora de sección con estrella de marca y glow rosa sutil.
 */
export function GlowBadge({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/5 px-3.5 py-1.5 text-[length:var(--text-eyebrow)] font-medium uppercase tracking-[0.22em] text-[var(--color-bright)] backdrop-blur",
        className,
      )}
    >
      <StarIcon className="h-3 w-3 text-[var(--color-bright)]" />
      {children}
    </span>
  );
}

export default GlowBadge;
