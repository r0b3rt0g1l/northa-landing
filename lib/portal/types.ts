/** Tipos de las tablas del portal (ver supabase/migrations/0002_amplia_portal.sql). */

export type Role = "admin" | "staff";

export interface Member {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface Contact {
  id: string;
  full_name: string;
  position: string | null;
  area: string | null;
  phone: string | null;
  extension: string | null;
  email: string | null;
  notes: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  published_at: string;
  author: { full_name: string } | null;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  url: string | null;
  file_path: string | null;
  file_name: string | null;
  created_at: string;
}

export interface RequestType {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
}

export type RequestStatus = "pendiente" | "aprobada" | "rechazada" | "completada";

export interface PortalRequest {
  id: string;
  title: string;
  details: string | null;
  starts_on: string | null;
  ends_on: string | null;
  status: RequestStatus;
  admin_note: string | null;
  created_at: string;
  requester_id: string;
  type: { name: string } | null;
  requester: { full_name: string } | null;
}

export type ProjectStatus = "por_iniciar" | "en_curso" | "en_revision" | "terminado";

export interface PortalProject {
  id: string;
  name: string;
  client: string | null;
  status: ProjectStatus;
  owner_id: string | null;
  due_on: string | null;
  notes: string | null;
  owner: { full_name: string } | null;
}

export const requestStatusLabel: Record<RequestStatus, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  completada: "Completada",
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  por_iniciar: "Por iniciar",
  en_curso: "En curso",
  en_revision: "En revisión",
  terminado: "Terminado",
};

/** Estado de un formulario manejado por useActionState. */
export interface ActionState {
  ok: boolean;
  error?: string;
  message?: string;
  /** Cambia en cada envío exitoso: sirve para limpiar el formulario. */
  stamp?: number;
}
