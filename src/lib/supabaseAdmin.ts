import { createClient, SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = global as unknown as { supabaseAdmin?: SupabaseClient };

/**
 * Returns a singleton Supabase client configured with the server service role key.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (globalForSupabase.supabaseAdmin) {
    return globalForSupabase.supabaseAdmin;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const client = createClient(url, serviceKey);
  if (process.env.NODE_ENV !== "production") {
    globalForSupabase.supabaseAdmin = client;
  }
  return client;
}
