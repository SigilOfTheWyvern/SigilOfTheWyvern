"use server";

import { revalidatePath } from "next/cache";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations";

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requirePermission("fan", "edit");
  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return;
  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });
  await writeAudit({ userId: user.id, action: "edit", resource: "fan", targetId: user.id });
  revalidatePath("/fan/profile");
}

export async function changePassword(formData: FormData): Promise<void> {
  const user = await requirePermission("fan", "edit");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) return;

  const supabase = await createSupabaseServerClient();
  const { error: check } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (check) return;

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return;

  await writeAudit({ userId: user.id, action: "edit", resource: "fan", targetId: user.id, meta: "password" });
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
