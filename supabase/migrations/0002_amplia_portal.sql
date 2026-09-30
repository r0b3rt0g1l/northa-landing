-- =====================================================================
-- Amplía Consultoría · portal interno (/amplia/portal)
-- ---------------------------------------------------------------------
-- ⚠️  Mismo proyecto NUEVO de la landing. NUNCA el de los municipios.
--
-- Qué crea:
--   amplia_members        personas con acceso (rol admin | staff)
--   amplia_contacts       directorio
--   amplia_announcements  comunicados
--   amplia_resources      recursos (enlace o archivo)
--   amplia_request_types  tipos de solicitud (los define Amplía)
--   amplia_requests       solicitudes
--   amplia_projects       proyectos
--   bucket privado "amplia-recursos" para archivos
--
-- Todo arranca VACÍO: no se precarga ningún dato. El primer admin se crea con
--   node --env-file=.env.local scripts/amplia-create-admin.mjs --email=... --name="..."
--
-- Seguridad: RLS en todas las tablas. Los miembros activos leen; solo los
-- admins escriben. Cada persona ve y crea sus propias solicitudes.
-- =====================================================================

-- ---------- Miembros ----------
create table if not exists public.amplia_members (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null check (char_length(full_name) between 2 and 80),
  email       text not null,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Funciones auxiliares (security definer: leen amplia_members sin recursión de RLS).
create or replace function public.amplia_is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.amplia_members m where m.id = auth.uid() and m.active);
$$;

create or replace function public.amplia_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.amplia_members m where m.id = auth.uid() and m.active and m.role = 'admin');
$$;

revoke all on function public.amplia_is_member() from public;
revoke all on function public.amplia_is_admin() from public;
grant execute on function public.amplia_is_member() to authenticated;
grant execute on function public.amplia_is_admin() to authenticated;

alter table public.amplia_members enable row level security;

drop policy if exists "miembros leen miembros" on public.amplia_members;
create policy "miembros leen miembros" on public.amplia_members
  for select to authenticated using (public.amplia_is_member());

-- Cada quien puede cambiar su nombre; rol y estado solo los cambia un admin (ver trigger).
drop policy if exists "cada quien edita su nombre" on public.amplia_members;
create policy "cada quien edita su nombre" on public.amplia_members
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "admin administra miembros" on public.amplia_members;
create policy "admin administra miembros" on public.amplia_members
  for all to authenticated using (public.amplia_is_admin()) with check (public.amplia_is_admin());

-- SECURITY INVOKER a propósito: así current_user es el rol real de quien llama
-- (authenticated desde el portal; service_role/postgres desde el servidor o el SQL Editor).
create or replace function public.amplia_members_guard() returns trigger
language plpgsql set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.active is distinct from old.active or new.email is distinct from old.email)
     and not public.amplia_is_admin()
     and current_user not in ('postgres', 'service_role', 'supabase_admin') then
    raise exception 'Solo un admin puede cambiar el rol, el estado o el correo.';
  end if;
  return new;
end;
$$;

drop trigger if exists amplia_members_guard on public.amplia_members;
create trigger amplia_members_guard before update on public.amplia_members
  for each row execute function public.amplia_members_guard();

-- Utilidad: updated_at automático
create or replace function public.amplia_touch() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Directorio ----------
create table if not exists public.amplia_contacts (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null check (char_length(full_name) between 2 and 100),
  position    text check (char_length(position) <= 100),
  area        text check (char_length(area) <= 100),
  phone       text check (char_length(phone) <= 30),
  extension   text check (char_length(extension) <= 10),
  email       text check (char_length(email) <= 120),
  notes       text check (char_length(notes) <= 500),
  created_by  uuid references public.amplia_members (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Comunicados ----------
create table if not exists public.amplia_announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 3 and 140),
  body         text not null check (char_length(body) <= 8000),
  pinned       boolean not null default false,
  author_id    uuid references public.amplia_members (id) on delete set null,
  published_at timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- Recursos ----------
create table if not exists public.amplia_resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 2 and 140),
  description text check (char_length(description) <= 500),
  category    text not null default 'General' check (char_length(category) between 2 and 60),
  url         text check (url is null or url ~* '^https?://'),
  file_path   text,
  file_name   text,
  created_by  uuid references public.amplia_members (id) on delete set null,
  created_at  timestamptz not null default now(),
  constraint amplia_resources_origen check (url is not null or file_path is not null)
);

-- ---------- Solicitudes ----------
create table if not exists public.amplia_request_types (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 2 and 60),
  description text check (char_length(description) <= 300),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.amplia_requests (
  id            uuid primary key default gen_random_uuid(),
  type_id       uuid not null references public.amplia_request_types (id) on delete restrict,
  requester_id  uuid not null default auth.uid() references public.amplia_members (id) on delete cascade,
  title         text not null check (char_length(title) between 3 and 140),
  details       text check (char_length(details) <= 2000),
  starts_on     date,
  ends_on       date,
  status        text not null default 'pendiente' check (status in ('pendiente', 'aprobada', 'rechazada', 'completada')),
  admin_note    text check (char_length(admin_note) <= 1000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint amplia_requests_fechas check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create index if not exists amplia_requests_requester_idx on public.amplia_requests (requester_id, created_at desc);

-- ---------- Proyectos ----------
create table if not exists public.amplia_projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 140),
  client      text check (char_length(client) <= 140),
  status      text not null default 'por_iniciar' check (status in ('por_iniciar', 'en_curso', 'en_revision', 'terminado')),
  owner_id    uuid references public.amplia_members (id) on delete set null,
  due_on      date,
  notes       text check (char_length(notes) <= 2000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Triggers updated_at ----------
drop trigger if exists amplia_contacts_touch on public.amplia_contacts;
create trigger amplia_contacts_touch before update on public.amplia_contacts for each row execute function public.amplia_touch();
drop trigger if exists amplia_announcements_touch on public.amplia_announcements;
create trigger amplia_announcements_touch before update on public.amplia_announcements for each row execute function public.amplia_touch();
drop trigger if exists amplia_requests_touch on public.amplia_requests;
create trigger amplia_requests_touch before update on public.amplia_requests for each row execute function public.amplia_touch();
drop trigger if exists amplia_projects_touch on public.amplia_projects;
create trigger amplia_projects_touch before update on public.amplia_projects for each row execute function public.amplia_touch();

-- ---------- RLS: leen los miembros, escriben los admins ----------
do $$
declare t text;
begin
  foreach t in array array['amplia_contacts', 'amplia_announcements', 'amplia_resources', 'amplia_request_types', 'amplia_projects'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "miembros leen" on public.%I', t);
    execute format('create policy "miembros leen" on public.%I for select to authenticated using (public.amplia_is_member())', t);
    execute format('drop policy if exists "admin escribe" on public.%I', t);
    execute format('create policy "admin escribe" on public.%I for all to authenticated using (public.amplia_is_admin()) with check (public.amplia_is_admin())', t);
  end loop;
end $$;

-- ---------- RLS: solicitudes ----------
alter table public.amplia_requests enable row level security;

drop policy if exists "ver mis solicitudes o todas si soy admin" on public.amplia_requests;
create policy "ver mis solicitudes o todas si soy admin" on public.amplia_requests
  for select to authenticated using (requester_id = auth.uid() or public.amplia_is_admin());

drop policy if exists "crear mis solicitudes" on public.amplia_requests;
create policy "crear mis solicitudes" on public.amplia_requests
  for insert to authenticated with check (public.amplia_is_member() and requester_id = auth.uid() and status = 'pendiente');

drop policy if exists "borrar mis solicitudes pendientes" on public.amplia_requests;
create policy "borrar mis solicitudes pendientes" on public.amplia_requests
  for delete to authenticated using ((requester_id = auth.uid() and status = 'pendiente') or public.amplia_is_admin());

drop policy if exists "admin actualiza solicitudes" on public.amplia_requests;
create policy "admin actualiza solicitudes" on public.amplia_requests
  for update to authenticated using (public.amplia_is_admin()) with check (public.amplia_is_admin());

-- ---------- Almacenamiento: bucket privado de recursos ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('amplia-recursos', 'amplia-recursos', false, 4194304)  -- 4 MB (límite de Vercel para subir desde el servidor)
on conflict (id) do nothing;

drop policy if exists "miembros descargan recursos" on storage.objects;
create policy "miembros descargan recursos" on storage.objects
  for select to authenticated using (bucket_id = 'amplia-recursos' and public.amplia_is_member());

drop policy if exists "admin sube recursos" on storage.objects;
create policy "admin sube recursos" on storage.objects
  for insert to authenticated with check (bucket_id = 'amplia-recursos' and public.amplia_is_admin());

drop policy if exists "admin borra recursos" on storage.objects;
create policy "admin borra recursos" on storage.objects
  for delete to authenticated using (bucket_id = 'amplia-recursos' and public.amplia_is_admin());
