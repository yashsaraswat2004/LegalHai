-- User billing / entitlements for LegalHai
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.user_entitlements (
  clerk_user_id text primary key,
  plan text not null default 'trial',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_subscription_status text,
  promo_code text,
  analyses_used int not null default 0,
  trial_limit int not null default 2,
  period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_entitlements_stripe_customer_idx
  on public.user_entitlements (stripe_customer_id);

alter table public.user_entitlements disable row level security;
grant all on public.user_entitlements to anon, authenticated, service_role;

notify pgrst, 'reload schema';
