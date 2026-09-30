import { PortalField, portalInput } from "./forms";
import { projectStatusLabel, type PortalProject, type ProjectStatus } from "@/lib/portal/types";

const STATUSES = Object.keys(projectStatusLabel) as ProjectStatus[];

export function ProjectFields({
  item,
  idPrefix,
  members,
}: {
  item?: PortalProject;
  idPrefix: string;
  members: { id: string; full_name: string }[];
}) {
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <PortalField label="Proyecto" htmlFor={`${idPrefix}-name`}>
          <input id={`${idPrefix}-name`} name="name" required maxLength={140} defaultValue={item?.name} className={portalInput} />
        </PortalField>
        <PortalField label="Cliente o dependencia" htmlFor={`${idPrefix}-client`} hint="opcional">
          <input id={`${idPrefix}-client`} name="client" maxLength={140} defaultValue={item?.client ?? ""} className={portalInput} />
        </PortalField>
        <PortalField label="Estado" htmlFor={`${idPrefix}-status`}>
          <select id={`${idPrefix}-status`} name="status" defaultValue={item?.status ?? "por_iniciar"} className={portalInput}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {projectStatusLabel[s]}
              </option>
            ))}
          </select>
        </PortalField>
        <PortalField label="Responsable" htmlFor={`${idPrefix}-owner`} hint="opcional">
          <select id={`${idPrefix}-owner`} name="owner_id" defaultValue={item?.owner_id ?? ""} className={portalInput}>
            <option value="">Sin asignar</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </PortalField>
        <PortalField label="Fecha de entrega" htmlFor={`${idPrefix}-due`} hint="opcional">
          <input id={`${idPrefix}-due`} name="due_on" type="date" defaultValue={item?.due_on ?? ""} className={portalInput} />
        </PortalField>
      </div>
      <PortalField label="Notas" htmlFor={`${idPrefix}-notes`} hint="opcional">
        <textarea id={`${idPrefix}-notes`} name="notes" rows={3} maxLength={2000} defaultValue={item?.notes ?? ""} className={portalInput} />
      </PortalField>
    </>
  );
}
