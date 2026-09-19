import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl(), supabasePublicKey());
}
