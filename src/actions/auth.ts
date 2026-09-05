"use server";

import { redirect } from "next/navigation";
import { ensureProfile } from "@/lib/profile";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations";

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not connected yet." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "The mark does not match. Check email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
  });
  if (error || !data.user) {
    return { error: "The mark does not match. Check email and password." };
  }

  await ensureProfile(data.user);

  const next = String(formData.get("next") || "/fan");
  const safeNext = next.startsWith("/") ? next : "/fan";
  redirect(safeNext);
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
