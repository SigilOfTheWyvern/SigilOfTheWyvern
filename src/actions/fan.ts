"use server";

import { revalidatePath } from "next/cache";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations";

export async function updateProfile(formData: FormData) {
  const user = await requirePermission("fan", "edit");
  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: "Give a real name." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });
  await writeAudit({ userId: user.id, action: "edit", resource: "fan", targetId: user.id });
  revalidatePath("/fan/profile");
  return { ok: true };
}

export async function changePassword(formData: FormData) {
  const user = await requirePermission("fan", "edit");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) {
    return { error: "New password must be 8+ characters." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: check } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (check) {
    return { error: "Current password is wrong." };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    return { error: error.message };
  }

  await writeAudit({ userId: user.id, action: "edit", resource: "fan", targetId: user.id, meta: "password" });
  return { ok: true };
}

export async function toggleFavorite(productId: string) {
  const user = await requirePermission("fan", "edit");
  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, productId } });
  }
  revalidatePath("/fan/saved");
  revalidatePath("/store");
}

export async function markNotificationsRead() {
  const user = await requirePermission("fan", "edit");
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/fan/notifications");
}
