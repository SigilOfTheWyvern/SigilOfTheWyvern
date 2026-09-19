"use server";

import { redirect } from "next/navigation";
import { ensureProfile } from "@/lib/profile";
import { isDatabaseConfigured } from "@/lib/prisma";
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

  const profile = await ensureProfile(data.user);
  if (!profile) {
    if (!isDatabaseConfigured()) {
      return {
        error: "Signed in, but the hall database is not connected. Add DATABASE_URL in Netlify → Environment variables (All scopes), then redeploy.",
      };
    }
    return { error: "Signed in, but the hall could not open. Check DATABASE_URL on Netlify and try again." };
  }

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
