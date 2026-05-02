import { createClient } from "@supabase/supabase-js";

/* 
  SQL to create the 'leads' table in your Supabase SQL Editor:

  create table leads (
    id uuid default gen_random_uuid() primary key,
    full_name text not null,
    email text not null,
    phone text not null,
    role text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Enable RLS
  alter table leads enable row level security;

  -- Create a policy that allows anyone to insert
  create policy "Enable insert for everyone" on leads for insert with check (true);
*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);
