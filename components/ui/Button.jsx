import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 will-change-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3";

const variants = {
  primary:
    "gradient-brand text-white shadow-[0_10px_34px_-10px_rgba(255,46,126,0.7)]",
  secondary:
    "border border-[var(--color-line)] bg-white/5 text-[var(--color-text)] backdrop-blur hover:border-[var(--color-bright)] hover:bg-white/10",
};

/**
 * Botón / enlace de acción. Renderiza <a> si se pasa `href`, si no <button>.
 * Compartido (sin estado) — válido en Server y Client.
 */
export function Button({
  href,
  variant = "primary",
  className,
  children,
  as,
  ...props
}) {
  const cls = cn(base, variants[variant] || variants.primary, className);

  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }

  const Comp = as || "button";
  return (
    <Comp className={cls} {...props}>
      {children}
    </Comp>
  );
}

export default Button;
