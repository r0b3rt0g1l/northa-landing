import { cn } from "@/lib/cn";
import { StarIcon } from "./StarIcon";

/**
 * Lockup de marca: símbolo de estrella en squircle + wordmark "Northa DIGITAL".
 * Componente compartido (sin estado) — válido en Server y Client.
 */
export function Logo({ className, withWordmark = true }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] border border-[var(--color-line)] bg-gradient-to-b from-[#1a1a1d] to-[#101012]">
        <StarIcon className="h-5 w-5" />
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
            Northa
          </span>
          <span className="mt-0.5 text-[0.58rem] font-light tracking-[0.38em] text-[var(--color-bright)]">
            DIGITAL
          </span>
        </span>
      )}
    </span>
  );
}

export default Logo;
