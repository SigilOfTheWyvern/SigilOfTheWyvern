function trim(value?: string) {
  return value?.trim() || "";
}

export function supabaseUrl() {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabasePublicKey() {
  return (
    trim(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function supabaseServiceKey() {
  const service = trim(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (service.includes(".")) return service;
  return "";
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabasePublicKey());
}

export function isSupabaseAdminConfigured() {
  return Boolean(supabaseUrl() && supabaseServiceKey());
}
