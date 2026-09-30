import { PortalField, portalInput } from "./forms";
import type { Contact } from "@/lib/portal/types";

export function ContactFields({ item, idPrefix }: { item?: Contact; idPrefix: string }) {
  const f = (name: keyof Contact, label: string, opts: { type?: string; hint?: string; max?: number; required?: boolean; auto?: string } = {}) => (
    <PortalField label={label} htmlFor={`${idPrefix}-${name}`} hint={opts.hint}>
      <input
        id={`${idPrefix}-${name}`}
        name={name}
        type={opts.type ?? "text"}
        required={opts.required}
        maxLength={opts.max}
        autoComplete={opts.auto ?? "off"}
        defaultValue={(item?.[name] as string | null | undefined) ?? ""}
        className={portalInput}
      />
    </PortalField>
  );
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {f("full_name", "Nombre completo", { required: true, max: 100 })}
        {f("position", "Puesto", { hint: "opcional", max: 100 })}
        {f("area", "Área o dependencia", { hint: "opcional", max: 100 })}
        {f("email", "Correo", { type: "email", hint: "opcional", max: 120 })}
        {f("phone", "Teléfono", { type: "tel", hint: "opcional", max: 30 })}
        {f("extension", "Extensión", { hint: "opcional", max: 10 })}
      </div>
      <PortalField label="Notas" htmlFor={`${idPrefix}-notes`} hint="opcional">
        <textarea id={`${idPrefix}-notes`} name="notes" rows={2} maxLength={500} defaultValue={item?.notes ?? ""} className={portalInput} />
      </PortalField>
    </>
  );
}
