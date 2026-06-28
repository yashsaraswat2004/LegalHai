-- Run once in Supabase Dashboard → SQL Editor → New query → Run
-- https://supabase.com/dashboard/project/_/sql

create table if not exists public.document_analyses (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  file_name text not null,
  language text not null,
  summary jsonb not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists document_analyses_user_created_idx
  on public.document_analyses (clerk_user_id, created_at desc);

-- Publishable/anon key cannot bypass RLS; disable for this table.
-- Server functions still scope reads/writes by Clerk user id.
-- For production, prefer SUPABASE_SERVICE_ROLE_KEY and re-enable RLS.
alter table public.document_analyses disable row level security;

grant all on public.document_analyses to anon, authenticated, service_role;

notify pgrst, 'reload schema';
