import { RoleBuilder } from "@/components/role-builder";
import { DashHeader } from "@/components/dash-ui";
import { prisma } from "@/lib/prisma";
import { hasPermission, isFounder, requirePermission } from "@/lib/rbac";

export default async function StudioRolesPage() {
  const user = await requirePermission("roles", "view");
  const roles = await prisma.role.findMany({
    include: { permissions: true, _count: { select: { users: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Access"
        title="Roles"
        hint="Permissions belong to the role. Founders always have every door. Custom roles start empty until you check boxes."
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
          canCreate={hasPermission(user, "roles", "create")}
          canEdit={hasPermission(user, "roles", "edit")}
          canDelete={hasPermission(user, "roles", "delete")}
          canManage={hasPermission(user, "roles", "manage")}
          founder={isFounder(user)}
        />
      </div>
    </main>
  );
}
