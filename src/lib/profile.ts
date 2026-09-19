import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

function displayName(user: User) {
  const meta = user.user_metadata ?? {};
  const fromMeta = String(meta.full_name || meta.name || "").trim();
  if (fromMeta) return fromMeta;
  return (user.email ?? "member").split("@")[0];
}

export async function ensureProfile(authUser: User) {
  const email = (authUser.email ?? "").toLowerCase();
  if (!email) return null;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { role: { include: { permissions: true } } },
    });
    if (existing) {
      if (existing.email !== email) {
        return prisma.user.update({
          where: { id: authUser.id },
          data: { email },
          include: { role: { include: { permissions: true } } },
        });
      }
      return existing;
    }

    const adminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const roleSlug = adminEmail && email === adminEmail ? "founder" : "fan";
    const role = await prisma.role.findUnique({ where: { slug: roleSlug } });
    if (!role) return null;

    return prisma.user.create({
      data: {
        id: authUser.id,
        email,
        name: displayName(authUser),
        roleId: role.id,
      },
      include: { role: { include: { permissions: true } } },
    });
  } catch (error) {
    console.error("ensureProfile", error);
    return null;
  }
}
