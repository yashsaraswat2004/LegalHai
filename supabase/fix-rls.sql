-- Run in Supabase SQL Editor if documents aren't saving.
-- Fixes Row Level Security blocking inserts from the app.

-- Option A: disable RLS (simplest for server-scoped Clerk user filtering)
alter table public.document_analyses disable row level security;

-- Option B: if you prefer RLS on, allow the API roles to read/write
-- (uncomment below and comment out disable above)
-- alter table public.document_analyses enable row level security;
-- drop policy if exists "document_analyses_allow_api" on public.document_analyses;
-- create policy "document_analyses_allow_api"
--   on public.document_analyses
--   for all
--   to anon, authenticated, service_role
--   using (true)
--   with check (true);

grant usage on schema public to anon, authenticated, service_role;
grant all on public.document_analyses to anon, authenticated, service_role;

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
