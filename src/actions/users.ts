"use server";

import { revalidatePath } from "next/cache";
import { recordChange, writeAudit } from "@/lib/audit";
import { ensureProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { ACTIONS, RESOURCES } from "@/lib/rbac-constants";
import { isSiteOwnerId } from "@/lib/owners";
import { isFounder, isPrivilegedSlug, requirePermission } from "@/lib/rbac";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";
import { roleSchema, userAdminSchema } from "@/lib/validations";

export async function saveUser(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const actor = await requirePermission("users", "edit");
  const parsed = userAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    roleId: formData.get("roleId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  const nextRole = await prisma.role.findUnique({ where: { id: parsed.data.roleId } });
  if (!nextRole) return;
  if (isPrivilegedSlug(nextRole.slug) && !isFounder(actor)) {
    return;
  }

  const previous = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
  if (previous && isPrivilegedSlug(previous.role.slug) && !isFounder(actor)) {
    return;
  }
  if (isSiteOwnerId(id) && (nextRole.slug !== "founder" || parsed.data.status !== "active")) {
    return;
  }
  if (previous?.role.slug === "founder" && nextRole.slug !== "founder") {
    const founders = await prisma.user.count({ where: { role: { slug: "founder" } } });
    if (founders <= 1) return;
  }
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      roleId: parsed.data.roleId,
      status: parsed.data.status,
    },
  });

  await recordChange({
    userId: actor.id,
    action: "edit",
    resource: "users",
    targetId: user.id,
    label: user.email,
    before: previous
      ? { name: previous.name, email: previous.email, role: previous.role.name, status: previous.status }
      : null,
    after: { name: user.name, email: user.email, role: nextRole.name, status: user.status },
  });
  revalidatePath("/studio/users");
}

export async function syncSupabaseUsers(): Promise<void> {
  const actor = await requirePermission("users", "create");
  const admin = createSupabaseAdmin();
  if (!admin) return;

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) return;

  let created = 0;
  for (const authUser of data.users) {
    const before = await prisma.user.findUnique({ where: { id: authUser.id } });
    const profile = await ensureProfile(authUser);
    if (profile && !before) created += 1;
  }

  await writeAudit({
    userId: actor.id,
    action: "create",
    resource: "users",
    meta: JSON.stringify({ synced: data.users.length, created }),
  });
  revalidatePath("/studio/users");
}

export async function deleteUser(id: string): Promise<void> {
  const actor = await requirePermission("users", "delete");
  if (actor.id === id) return;

  const target = await prisma.user.findUnique({ where: { id }, include: { role: true } });
  if (!target) return;
  if (isSiteOwnerId(id)) return;
  if (isPrivilegedSlug(target.role.slug) && !isFounder(actor)) {
    return;
  }
  if (target.role.slug === "founder") {
    const founders = await prisma.user.count({ where: { role: { slug: "founder" } } });
    if (founders <= 1) return;
  }

  const [orders, tickets, uploads] = await Promise.all([
    prisma.order.count({ where: { userId: id } }),
    prisma.ticket.count({ where: { userId: id } }),
    prisma.mediaAsset.count({ where: { uploadedBy: id } }),
  ]);
  if (orders || tickets || uploads) return;

  await prisma.auditLog.updateMany({ where: { userId: id }, data: { userId: null } });

  const admin = createSupabaseAdmin();
  if (admin) {
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return;
  }

  await prisma.user.delete({ where: { id } });
  await recordChange({
    userId: actor.id,
    action: "delete",
    resource: "users",
    targetId: id,
    label: target.email,
    before: { email: target.email, name: target.name, role: target.role.name },
    after: null,
  });
  revalidatePath("/studio/users");
}

export async function saveRole(formData: FormData): Promise<void> {
  const actor = await requirePermission("roles", formData.get("id") ? "edit" : "create");
  const parsed = roleSchema.safeParse({
    name: formData.get("name"),
    slug: String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description"),
    color: formData.get("color") || "#c4a574",
  });
  if (!parsed.success) return;
  const id = String(formData.get("id") || "");
  if (id) {
    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) return;
    if (existing.isSystem && parsed.data.slug !== existing.slug) {
      return;
    }
  }
  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    color: parsed.data.color ?? "#c4a574",
  };
  const previous = id ? await prisma.role.findUnique({ where: { id } }) : null;
  const role = id
    ? await prisma.role.update({ where: { id }, data })
    : await prisma.role.create({ data: { ...data, isSystem: false } });
  await recordChange({
    userId: actor.id,
    action: id ? "edit" : "create",
    resource: "roles",
    targetId: role.id,
    label: role.name,
    before: previous ? { name: previous.name, slug: previous.slug, description: previous.description, color: previous.color } : null,
    after: { name: role.name, slug: role.slug, description: role.description, color: role.color },
  });
  if (formData.get("permissionsSet") === "1") {
    const canManage =
      isFounder(actor) ||
      actor.role.permissions.some(
        (permission) =>
          (permission.resource === "roles" && permission.action === "manage") ||
          (permission.resource === "*" && permission.action === "*"),
      );
    if (canManage) {
      await setRolePermissions(role.id, formData.getAll("permissions").map(String));
    }
  }
  revalidatePath("/studio/roles");
}

export async function setRolePermissions(roleId: string, raw: string[]) {
  const actor = await requirePermission("roles", "manage");
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) return { error: "Role not found." };
  if (isPrivilegedSlug(role.slug) && !isFounder(actor)) {
    return { error: "Only a founder can change that role." };
  }
  if (role.slug === "founder") {
    return { error: "Founder permissions cannot be reduced." };
  }

  let allowed = raw.filter((entry) => {
    const [resource, action] = entry.split(":");
    return RESOURCES.includes(resource as (typeof RESOURCES)[number]) &&
      ACTIONS.includes(action as (typeof ACTIONS)[number]);
  });

  if (role.slug === "fan") {
    allowed = allowed.filter((entry) => !entry.startsWith("studio:"));
  }
  const previousPerms = await prisma.rolePermission.findMany({ where: { roleId } });
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({
      data: allowed.map((entry) => {
        const [resource, action] = entry.split(":");
        return { roleId, resource, action };
      }),
    }),
  ]);
  await recordChange({
    userId: actor.id,
    action: "manage",
    resource: "roles",
    targetId: roleId,
    label: role.name,
    before: { permissions: previousPerms.map((item) => `${item.resource}:${item.action}`).sort().join(", ") },
    after: { permissions: allowed.slice().sort().join(", ") },
  });
  revalidatePath("/studio/roles");
  return { ok: true };
}

export async function duplicateRole(id: string): Promise<void> {
  const actor = await requirePermission("roles", "create");
  const source = await prisma.role.findUnique({
    where: { id },
    include: { permissions: true },
  });
  if (!source) return;
  const slug = `${source.slug}-copy-${Date.now().toString(36)}`;
  const copy = await prisma.role.create({
    data: {
      name: `${source.name} copy`,
      slug,
      description: source.description,
      color: source.color,
      isSystem: false,
      permissions: {
        create: source.permissions.map((permission) => ({
          resource: permission.resource,
          action: permission.action,
        })),
      },
    },
  });
  await recordChange({
    userId: actor.id,
    action: "create",
    resource: "roles",
    targetId: copy.id,
    label: copy.name,
    note: `Duplicated from ${source.name}`,
    after: { name: copy.name, slug: copy.slug },
  });
  revalidatePath("/studio/roles");
}

export async function deleteRole(id: string): Promise<void> {
  const actor = await requirePermission("roles", "delete");
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });
  if (!role) return;
  if (role.slug === "founder" || role.slug === "fan" || isPrivilegedSlug(role.slug)) return;
  if (!isFounder(actor)) {
    if (role.isSystem) return;
    if (role._count.users > 0) return;
  }
  if (role._count.users > 0) {
    const fan = await prisma.role.findUnique({ where: { slug: "fan" } });
    if (!fan) return;
    await prisma.user.updateMany({ where: { roleId: id }, data: { roleId: fan.id } });
  }
  await prisma.role.delete({ where: { id } });
  await recordChange({
    userId: actor.id,
    action: "delete",
    resource: "roles",
    targetId: id,
    label: role.name,
    before: { name: role.name, slug: role.slug },
    after: null,
  });
  revalidatePath("/studio/roles");
  revalidatePath("/studio/users");
}
