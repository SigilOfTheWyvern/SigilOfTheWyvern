import { createClient } from "@supabase/supabase-js";
import { isSupabaseAdminConfigured, supabaseServiceKey, supabaseUrl } from "@/lib/supabase/env";

export function createSupabaseAdmin() {
  if (!isSupabaseAdminConfigured()) return null;
  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
