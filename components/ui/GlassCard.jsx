import { cn } from "@/lib/cn";

/**
 * Tarjeta con glassmorphism sutil: borde hairline, fondo translúcido con blur y
 * un brillo rosa que aparece en hover. Sin JS.
 */
export function GlassCard({ className, children, featured = false }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/[0.03] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        featured
          ? "border-[var(--color-bright)]/50 shadow-[0_30px_80px_-30px_rgba(255,46,126,0.45)]"
          : "border-[var(--color-line)] hover:border-[var(--color-bright)]/40 hover:shadow-[0_24px_60px_-24px_rgba(255,46,126,0.35)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at 20% 0%, rgba(255,77,147,0.14), transparent 55%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default GlassCard;
