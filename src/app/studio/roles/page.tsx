import { RoleBuilder } from "@/components/role-builder";
import { DashHeader } from "@/components/dash-ui";
import { ensureSystemRoles } from "@/lib/ensure-roles";
import { prisma } from "@/lib/prisma";
import { hasPermission, isFounder, requirePermission } from "@/lib/rbac";

export default async function StudioRolesPage() {
  const user = await requirePermission("roles", "view");
  await ensureSystemRoles();
  const order = ["founder", "developer", "band-member", "fan"];
  const roles = (
    await prisma.role.findMany({
      include: { permissions: true, _count: { select: { users: true } } },
    })
  ).sort((left, right) => {
    const leftIndex = order.indexOf(left.slug);
    const rightIndex = order.indexOf(right.slug);
    return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
  });

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Access"
        title="Roles"
        hint="Only four roles: Founder, Developer, Band Member, and Fan. Founder and Developer hold every permission."
      />
      <div className="mt-10">
        <RoleBuilder
          roles={roles.map((role) => ({
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            color: role.color,
            isSystem: role.isSystem,
            userCount: role._count.users,
            permissions: role.permissions.map((permission) => `${permission.resource}:${permission.action}`),
          }))}
          canCreate={false}
          canEdit={hasPermission(user, "roles", "edit")}
          canDelete={false}
          canManage={hasPermission(user, "roles", "manage")}
          founder={isFounder(user)}
        />
      </div>
    </main>
  );
}
