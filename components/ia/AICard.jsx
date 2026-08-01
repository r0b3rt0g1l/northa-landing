/**
 * Tarjeta de servicio de IA — destacada con ícono en gradiente de marca y
 * micro-interacción de elevación + escala en hover (CSS, sin JS).
 * `icon` es un elemento ya renderizado (pasado desde el wrapper server).
 */
export function AICard({ icon, title, description }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-bright)]/50 hover:shadow-[0_20px_60px_-15px_rgba(255,46,126,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,122,179,0.16), transparent 45%)",
        }}
      />
      <div className="relative">
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white shadow-[0_8px_24px_-8px_rgba(255,46,126,0.7)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          {icon}
        </span>
        <h3 className="text-[length:var(--text-h3)] font-semibold">{title}</h3>
        <p className="mt-3 text-[var(--color-muted)]">{description}</p>
      </div>
    </div>
  );
}

export default AICard;
