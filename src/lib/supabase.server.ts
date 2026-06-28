import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serverClient: SupabaseClient | null | undefined;

function getSupabaseUrl(): string | undefined {
  return (
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    import.meta.env.VITE_SUPABASE_URL
  );
}

/**
 * Server writes need a secret/service key (bypasses RLS).
 * Publishable key only works when RLS is off or policies allow it.
 */
function getSupabaseKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VITE_SUPABASE_SECRET_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

export function isUsingSecretKey(): boolean {
  return Boolean(
    process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.VITE_SUPABASE_SECRET_KEY,
  );
}

/** Server-only Supabase client for document history. */
export function getSupabaseServer(): SupabaseClient | null {
  if (serverClient !== undefined) return serverClient;

  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    console.warn(
      "Document storage unavailable: set VITE_SUPABASE_URL and SUPABASE_SECRET_KEY (or VITE_SUPABASE_ANON_KEY).",
    );
    serverClient = null;
    return null;
  }

  if (!isUsingSecretKey()) {
    console.warn(
      "Using publishable key for document storage — run supabase/fix-rls.sql if saves fail.",
    );
  }

  serverClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serverClient;
}

export async function probeDocumentStorage(): Promise<{
  configured: boolean;
  tableExists: boolean;
  usingSecretKey: boolean;
}> {
  const supabase = getSupabaseServer();
  if (!supabase) return { configured: false, tableExists: false, usingSecretKey: false };

  const { error } = await supabase.from("document_analyses").select("id").limit(1);
  if (!error) {
    return { configured: true, tableExists: true, usingSecretKey: isUsingSecretKey() };
  }

  const missingTable =
    error.code === "PGRST205" ||
    error.message.includes("Could not find the table") ||
    error.message.includes("schema cache");

  return { configured: true, tableExists: !missingTable, usingSecretKey: isUsingSecretKey() };
}
