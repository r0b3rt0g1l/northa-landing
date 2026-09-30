-- =====================================================================
-- Northa Digital · landing · tabla de leads
-- ---------------------------------------------------------------------
-- ⚠️  Aplica esto en un proyecto de Supabase NUEVO, exclusivo de la landing.
--     NUNCA en el proyecto compartido de los municipios (qpilnqzgsndymktgodoq):
--     el código de la landing se niega a escribir ahí, y esta migración
--     tampoco debe correrse ahí.
--
-- Cómo aplicarla: Supabase → SQL Editor → pega este archivo → Run.
-- (Revisa el SQL antes de ejecutarlo; no borra ni modifica nada existente.)
-- =====================================================================

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  source      text not null check (source in ('form', 'chat', 'scope')),
  locale      text not null check (locale in ('es', 'en')),
  name        text not null check (char_length(name) between 2 and 80),
  email       text check (email is null or char_length(email) <= 120),
  phone       text check (phone is null or char_length(phone) <= 25),
  company     text check (company is null or char_length(company) <= 120),
  service     text check (service is null or char_length(service) <= 200),
  message     text not null check (char_length(message) <= 2000),
  meta        jsonb not null default '{}'::jsonb,
  status      text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'descartado', 'cliente')),
  constraint leads_contacto check (email is not null or phone is not null)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS activado y SIN políticas: nadie puede leer ni escribir desde el navegador.
-- La landing inserta desde el servidor con la llave secreta (SUPABASE_SECRET_KEY),
-- que ignora RLS. Consulta los leads desde el panel de Supabase (Table Editor).
alter table public.leads enable row level security;

comment on table public.leads is 'Leads de la landing de Northa (formulario, chat Nort y "Arma tu proyecto").';
