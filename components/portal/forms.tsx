"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CerroLoader } from "@/components/brand/CerroLoader";
import type { ActionState } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

export const portalInput =
  "w-full rounded-xl border border-line-2 bg-bg/60 px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent-line";
export const portalLabel = "mb-1.5 block text-sm font-medium text-dim";

type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * Formulario conectado a una Server Action con useActionState.
 * Muestra el error o el mensaje de éxito (anunciados) y limpia el formulario
 * después de guardar, salvo `keepValues`.
 */
export function ActionForm({
  action,
  submitLabel,
  children,
  className,
  keepValues = false,
  submitClassName,
}: {
  action: Action;
  submitLabel: string;
  children: React.ReactNode;
  className?: string;
  keepValues?: boolean;
  submitClassName?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false });
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.stamp && !keepValues) ref.current?.reset();
  }, [state, keepValues]);

  // React 19 limpia el formulario después de cada acción, aun si hubo un error de
  // validación. Despachamos a mano para conservar lo escrito y limpiar solo al guardar.
  // `action` se queda para que funcione también sin JavaScript.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };

  return (
    <form ref={ref} action={formAction} onSubmit={onSubmit} aria-busy={pending} className={cn("grid gap-4", className)}>
      {children}
      {state.error && (
        <p role="alert" className="rounded-xl border border-accent-line bg-accent-soft px-4 py-3 text-sm text-ink">
          {state.error}
        </p>
      )}
      {state.ok && state.message && (
        <p role="status" className="rounded-xl border border-line-2 bg-surface-2 px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      )}
      <div>
        <SubmitButton label={submitLabel} className={submitClassName} pending={pending} />
      </div>
    </form>
  );
}

export function SubmitButton({ label, className, pending }: { label: string; className?: string; pending?: boolean }) {
  const status = useFormStatus();
  const busy = pending ?? status.pending;
  return (
    <button
      type="submit"
      disabled={busy}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent-strong px-5 text-sm font-semibold text-accent-contrast transition-opacity disabled:opacity-70",
        className,
      )}
    >
      {busy && <CerroLoader size={18} decorative mono />}
      {label}
    </button>
  );
}

/** Botón de borrado en dos pasos: primero pide confirmación, luego envía. */
export function DeleteButton({
  action,
  id,
  label = "Eliminar",
  confirmLabel = "Sí, eliminar",
  extra,
}: {
  action: (fd: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmLabel?: string;
  extra?: Record<string, string>;
}) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="inline-flex h-9 items-center rounded-full border border-line-2 px-3.5 text-sm text-dim transition-colors hover:border-accent-line hover:text-ink"
      >
        {label}
      </button>
    );
  }
  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {extra && Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <SubmitButton label={confirmLabel} className="h-9 px-3.5" />
      <button type="button" onClick={() => setArmed(false)} className="h-9 rounded-full px-3 text-sm text-dim hover:text-ink">
        Cancelar
      </button>
    </form>
  );
}

/** Campo con etiqueta. */
export function PortalField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={portalLabel}>
        {label}
        {hint && <span className="ml-1.5 font-normal text-faint">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
