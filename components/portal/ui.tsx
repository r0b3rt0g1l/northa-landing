import { cn } from "@/lib/utils";

export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[clamp(1.8rem,1.4rem+1.4vw,2.6rem)] text-ink">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-dim">{lead}</p>}
      </div>
      {children}
    </header>
  );
}

export function EmptyState({ title, body, children }: { title: string; body?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-line-2 bg-surface/40 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-md text-sm text-dim">{body}</p>}
      {children && <div className="mt-5 flex justify-center">{children}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-[1.5rem] border border-line bg-surface/70 p-5 md:p-6", className)}>{children}</div>;
}

/** Panel desplegable nativo (<details>): funciona sin JavaScript y con teclado. */
export function Disclosure({
  summary,
  children,
  className,
  open,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}) {
  return (
    <details open={open} className={cn("group rounded-[1.25rem] border border-line bg-surface/60", className)}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {summary}
        <span aria-hidden className="text-lg leading-none text-faint transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-line p-4 md:p-5">{children}</div>
    </details>
  );
}

const tone: Record<string, string> = {
  pendiente: "border-amber-400/40 bg-amber-400/10 text-ink",
  aprobada: "border-emerald-400/40 bg-emerald-400/10 text-ink",
  rechazada: "border-rose-400/40 bg-rose-400/10 text-ink",
  completada: "border-line-2 bg-surface-2 text-dim",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", tone[status] ?? tone.completada)}>
      {label}
    </span>
  );
}

/** Fecha corta en la zona de Hermosillo ("29 sep 2026"). Acepta "YYYY-MM-DD" o ISO. */
export function shortDate(value: string | null | undefined): string {
  if (!value) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: dateOnly ? "UTC" : "America/Hermosillo",
  }).format(new Date(value));
}
