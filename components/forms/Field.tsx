import { cn } from "@/lib/utils";

/** Campo accesible: etiqueta visible, error ligado con aria-describedby. */
export function Field({
  id,
  label,
  optionalLabel,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  optionalLabel?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optionalLabel && <span className="ml-1.5 font-normal text-faint">({optionalLabel})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-accent-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line-2 bg-bg/60 px-4 text-[1rem] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent aria-[invalid=true]:border-accent-ink";
