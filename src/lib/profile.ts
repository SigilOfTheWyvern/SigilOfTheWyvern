import type { User } from "@supabase/supabase-js";
import { ensureHallRoles } from "@/lib/ensure-roles";
import { isSiteOwner } from "@/lib/owners";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

function displayName(user: User) {
  const meta = user.user_metadata ?? {};
  const fromMeta = String(meta.full_name || meta.name || "").trim();
  if (fromMeta) return fromMeta;
  return (user.email ?? "member").split("@")[0];
}

export async function ensureProfile(authUser: User) {
  const email = (authUser.email ?? "").toLowerCase();
  if (!email) return null;
  if (!isDatabaseConfigured()) return null;

  try {
    await ensureHallRoles();
    const existing = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { role: { include: { permissions: true } } },
    });
    const owner = isSiteOwner({ id: authUser.id, email });
    if (existing) {
      const patch: { email?: string; roleId?: string; status?: string } = {};
      if (existing.email !== email) patch.email = email;
      if (owner) {
        const founder = await prisma.role.findUnique({ where: { slug: "founder" } });
        if (founder && existing.roleId !== founder.id) patch.roleId = founder.id;
        if (existing.status !== "active") patch.status = "active";
      }
      if (Object.keys(patch).length > 0) {
        return prisma.user.update({
          where: { id: authUser.id },
          data: patch,
          include: { role: { include: { permissions: true } } },
        });
      }
      return existing;
    }

    const roleSlug = owner ? "founder" : "fan";
    const role = await prisma.role.findUnique({ where: { slug: roleSlug } });
    if (!role) return null;

    return prisma.user.create({
      data: {
        id: authUser.id,
        email,
        name: displayName(authUser),
        status: "active",
        roleId: role.id,
      },
      include: { role: { include: { permissions: true } } },
    });
  } catch (error) {
    console.error("ensureProfile", error);
    return null;
  }
}
