"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient, createPortalClient } from "@/lib/supabase/server";
import { portalConfigured } from "@/lib/supabase/config";
import { LOGIN, PORTAL, requireAdmin, requireMember } from "@/lib/portal/session";
import type { ActionState } from "@/lib/portal/types";

/*
 * Acciones del portal de Amplía.
 * Cada acción comprueba sesión y rol ANTES de tocar datos (las acciones se pueden
 * invocar con un POST directo). Además, Supabase aplica RLS a todo lo que pasa
 * por createPortalClient(): doble candado.
 */

const ok = (message?: string): ActionState => ({ ok: true, message, stamp: Date.now() });
const fail = (error: string): ActionState => ({ ok: false, error });
const refreshPortal = () => revalidatePath(PORTAL, "layout");

/** Texto opcional: "" → null. */
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));
const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), "Fecha inválida");

function fields(fd: FormData) {
  return Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
}

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Revisa los datos del formulario.";
}

/* ------------------------------------------------------------------ */
/* Sesión                                                              */
/* ------------------------------------------------------------------ */

const signInSchema = z.object({
  email: z.email("Escribe un correo válido.").max(120),
  password: z.string().min(1, "Escribe tu contraseña.").max(200),
});

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!portalConfigured()) return fail("El portal aún no está configurado.");
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(`portal-login:${ip}`, 8, 10 * 60 * 1000).ok) {
    return fail("Demasiados intentos. Espera unos minutos e intenta de nuevo.");
  }
  const parsed = signInSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createPortalClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return fail("Correo o contraseña incorrectos.");

  const { data: member } = await supabase
    .from("amplia_members")
    .select("active")
    .eq("id", data.user.id)
    .maybeSingle<{ active: boolean }>();
  if (!member?.active) {
    await supabase.auth.signOut();
    return fail("Tu cuenta no tiene acceso activo al portal. Pídeselo a tu administrador.");
  }
  redirect(PORTAL);
}

export async function signOut(): Promise<void> {
  if (portalConfigured()) {
    const supabase = await createPortalClient();
    await supabase.auth.signOut();
  }
  redirect(LOGIN);
}

export async function updateMyName(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireMember();
  const parsed = z.object({ full_name: z.string().trim().min(2, "Escribe tu nombre.").max(80) }).safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const supabase = await createPortalClient();
  const { error } = await supabase.from("amplia_members").update({ full_name: parsed.data.full_name }).eq("id", me.id);
  if (error) return fail("No se pudo guardar tu nombre.");
  refreshPortal();
  return ok("Nombre actualizado.");
}

export async function updateMyPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireMember();
  const parsed = z
    .object({
      password: z.string().min(10, "Usa al menos 10 caracteres.").max(200),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, { message: "Las contraseñas no coinciden.", path: ["confirm"] })
    .safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const supabase = await createPortalClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return fail("No se pudo cambiar la contraseña. Intenta con otra.");
  return ok("Contraseña actualizada.");
}

/* ------------------------------------------------------------------ */
/* Comunicados (admin)                                                 */
/* ------------------------------------------------------------------ */

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "El título es muy corto.").max(140),
  body: z.string().trim().min(1, "Escribe el comunicado.").max(8000),
  pinned: z.string().optional(),
});

export async function saveAnnouncement(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const parsed = announcementSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { id, title, body, pinned } = parsed.data;
  const supabase = await createPortalClient();
  const row = { title, body, pinned: pinned === "on" };
  const { error } = id
    ? await supabase.from("amplia_announcements").update(row).eq("id", id)
    : await supabase.from("amplia_announcements").insert({ ...row, author_id: me.id });
  if (error) return fail("No se pudo guardar el comunicado.");
  refreshPortal();
  return ok(id ? "Comunicado actualizado." : "Comunicado publicado.");
}

export async function deleteAnnouncement(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const supabase = await createPortalClient();
  await supabase.from("amplia_announcements").delete().eq("id", id);
  refreshPortal();
}

export async function toggleAnnouncementPin(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const pinned = fd.get("pinned") === "true";
  const supabase = await createPortalClient();
  await supabase.from("amplia_announcements").update({ pinned: !pinned }).eq("id", id);
  refreshPortal();
}

/* ------------------------------------------------------------------ */
/* Directorio (admin)                                                  */
/* ------------------------------------------------------------------ */

const contactSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().trim().min(2, "Escribe el nombre.").max(100),
  position: optional(100),
  area: optional(100),
  phone: optional(30),
  extension: optional(10),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Revisa el correo.")
    .transform((v) => (v === "" ? null : v)),
  notes: optional(500),
});

export async function saveContact(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const parsed = contactSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { id, ...row } = parsed.data;
  const supabase = await createPortalClient();
  const { error } = id
    ? await supabase.from("amplia_contacts").update(row).eq("id", id)
    : await supabase.from("amplia_contacts").insert({ ...row, created_by: me.id });
  if (error) return fail("No se pudo guardar el contacto.");
  refreshPortal();
  return ok(id ? "Contacto actualizado." : "Contacto agregado.");
}

export async function deleteContact(fd: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createPortalClient();
  await supabase.from("amplia_contacts").delete().eq("id", String(fd.get("id") ?? ""));
  refreshPortal();
}

/* ------------------------------------------------------------------ */
/* Recursos (admin)                                                    */
/* ------------------------------------------------------------------ */

const MAX_FILE = 4 * 1024 * 1024; // Vercel limita el cuerpo de la petición a ~4.5 MB

const resourceSchema = z.object({
  title: z.string().trim().min(2, "Escribe un título.").max(140),
  description: optional(500),
  category: z
    .string()
    .trim()
    .max(60)
    .transform((v) => v || "General"),
  url: z
    .string()
    .trim()
    .max(2000)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "El enlace debe empezar con https://")
    .transform((v) => (v === "" ? null : v)),
});

export async function saveResource(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const parsed = resourceSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const file = fd.get("file");
  const hasFile = file instanceof File && file.size > 0;
  if (!parsed.data.url && !hasFile) return fail("Pega un enlace o adjunta un archivo.");
  if (hasFile && file.size > MAX_FILE) return fail("El archivo pesa más de 4 MB. Súbelo a Drive y pega el enlace.");

  const supabase = await createPortalClient();
  let file_path: string | null = null;
  let file_name: string | null = null;
  if (hasFile) {
    const safe = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "-").slice(-80);
    file_path = `${crypto.randomUUID()}/${safe}`;
    file_name = file.name.slice(0, 140);
    const { error: upErr } = await supabase.storage
      .from("amplia-recursos")
      .upload(file_path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (upErr) return fail("No se pudo subir el archivo.");
  }
  const { error } = await supabase.from("amplia_resources").insert({ ...parsed.data, file_path, file_name, created_by: me.id });
  if (error) {
    if (file_path) await supabase.storage.from("amplia-recursos").remove([file_path]);
    return fail("No se pudo guardar el recurso.");
  }
  refreshPortal();
  return ok("Recurso agregado.");
}

export async function deleteResource(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const supabase = await createPortalClient();
  const { data } = await supabase.from("amplia_resources").select("file_path").eq("id", id).maybeSingle<{ file_path: string | null }>();
  await supabase.from("amplia_resources").delete().eq("id", id);
  if (data?.file_path) await supabase.storage.from("amplia-recursos").remove([data.file_path]);
  refreshPortal();
}

/* ------------------------------------------------------------------ */
/* Solicitudes                                                         */
/* ------------------------------------------------------------------ */

export async function saveRequestType(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({ name: z.string().trim().min(2, "Escribe el nombre del tipo.").max(60), description: optional(300) })
    .safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const supabase = await createPortalClient();
  const { error } = await supabase.from("amplia_request_types").insert(parsed.data);
  if (error) return fail(error.code === "23505" ? "Ya existe un tipo con ese nombre." : "No se pudo guardar el tipo.");
  refreshPortal();
  return ok("Tipo de solicitud agregado.");
}

export async function toggleRequestType(fd: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createPortalClient();
  await supabase
    .from("amplia_request_types")
    .update({ active: fd.get("active") !== "true" })
    .eq("id", String(fd.get("id") ?? ""));
  refreshPortal();
}

const requestSchema = z
  .object({
    type_id: z.string().min(1, "Elige el tipo de solicitud."),
    title: z.string().trim().min(3, "Escribe un título breve.").max(140),
    details: optional(2000),
    starts_on: optionalDate,
    ends_on: optionalDate,
  })
  .refine((d) => !d.starts_on || !d.ends_on || d.ends_on >= d.starts_on, {
    message: "La fecha final no puede ser anterior a la inicial.",
    path: ["ends_on"],
  });

export async function createRequest(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireMember();
  const parsed = requestSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const supabase = await createPortalClient();
  const { error } = await supabase.from("amplia_requests").insert({ ...parsed.data, requester_id: me.id, status: "pendiente" });
  if (error) return fail("No se pudo enviar la solicitud.");
  refreshPortal();
  return ok("Solicitud enviada.");
}

export async function updateRequestStatus(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({
      id: z.string().min(1),
      status: z.enum(["pendiente", "aprobada", "rechazada", "completada"]),
      admin_note: optional(1000),
    })
    .safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { id, ...row } = parsed.data;
  const supabase = await createPortalClient();
  const { error } = await supabase.from("amplia_requests").update(row).eq("id", id);
  if (error) return fail("No se pudo actualizar la solicitud.");
  refreshPortal();
  return ok("Solicitud actualizada.");
}

export async function deleteRequest(fd: FormData): Promise<void> {
  await requireMember(); // RLS: solo la propia si está pendiente, o admin
  const supabase = await createPortalClient();
  await supabase.from("amplia_requests").delete().eq("id", String(fd.get("id") ?? ""));
  refreshPortal();
}

/* ------------------------------------------------------------------ */
/* Proyectos (admin)                                                   */
/* ------------------------------------------------------------------ */

const projectStatus = z.enum(["por_iniciar", "en_curso", "en_revision", "terminado"]);

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Escribe el nombre del proyecto.").max(140),
  client: optional(140),
  status: projectStatus,
  owner_id: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v)),
  due_on: optionalDate,
  notes: optional(2000),
});

export async function saveProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { id, ...row } = parsed.data;
  const supabase = await createPortalClient();
  const { error } = id
    ? await supabase.from("amplia_projects").update(row).eq("id", id)
    : await supabase.from("amplia_projects").insert(row);
  if (error) return fail("No se pudo guardar el proyecto.");
  refreshPortal();
  return ok(id ? "Proyecto actualizado." : "Proyecto creado.");
}

export async function setProjectStatus(fd: FormData): Promise<void> {
  await requireAdmin();
  const status = projectStatus.safeParse(fd.get("status"));
  if (!status.success) return;
  const supabase = await createPortalClient();
  await supabase.from("amplia_projects").update({ status: status.data }).eq("id", String(fd.get("id") ?? ""));
  refreshPortal();
}

export async function deleteProject(fd: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createPortalClient();
  await supabase.from("amplia_projects").delete().eq("id", String(fd.get("id") ?? ""));
  refreshPortal();
}

/* ------------------------------------------------------------------ */
/* Usuarios (admin)                                                    */
/* ------------------------------------------------------------------ */

const newMemberSchema = z.object({
  full_name: z.string().trim().min(2, "Escribe el nombre completo.").max(80),
  email: z.email("Escribe un correo válido.").max(120),
  role: z.enum(["admin", "staff"]),
  password: z.string().min(10, "La contraseña temporal debe tener al menos 10 caracteres.").max(200),
});

export async function createMemberAccount(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = newMemberSchema.safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { full_name, email, role, password } = parsed.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return fail("Falta configurar SUPABASE_SECRET_KEY en el servidor.");
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (error || !data.user) {
    return fail(/already|registered|exists/i.test(error?.message ?? "") ? "Ya existe una cuenta con ese correo." : "No se pudo crear la cuenta.");
  }
  const { error: memberError } = await admin
    .from("amplia_members")
    .insert({ id: data.user.id, full_name, email: email.toLowerCase(), role, active: true });
  if (memberError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return fail("No se pudo registrar a la persona en el portal.");
  }
  refreshPortal();
  return ok(`Cuenta creada. Comparte la contraseña temporal con ${full_name} por un medio seguro; podrá cambiarla en "Mi cuenta".`);
}

export async function updateMember(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const parsed = z
    .object({ id: z.string().min(1), role: z.enum(["admin", "staff"]), active: z.string().optional() })
    .safeParse(fields(fd));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { id, role } = parsed.data;
  const active = parsed.data.active === "on";

  const supabase = await createPortalClient();
  if (id === me.id && (role !== "admin" || !active)) {
    const { count } = await supabase
      .from("amplia_members")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .eq("active", true);
    if ((count ?? 0) <= 1) return fail("Eres el único admin activo: nombra a otro admin antes de cambiar tu rol.");
  }
  const { error } = await supabase.from("amplia_members").update({ role, active }).eq("id", id);
  if (error) return fail("No se pudo actualizar a la persona.");
  refreshPortal();
  return ok("Cambios guardados.");
}
