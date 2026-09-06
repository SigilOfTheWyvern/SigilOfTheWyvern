import { deleteUser, saveUser, syncSupabaseUsers } from "@/actions/users";
import { ConfirmButton } from "@/components/confirm-button";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioUsersPage() {
  const actor = await requirePermission("users", "view");
  const [users, roles] = await Promise.all([
    prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);
  const canEdit = hasPermission(actor, "users", "edit");
  const canSync = hasPermission(actor, "users", "create");
  const canDelete = hasPermission(actor, "users", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Access"
        title="Users"
        hint="Logins live in Supabase. Roles here decide Studio, Hall, and every other door."
        action={
          canSync ? (
            <form action={syncSupabaseUsers}>
              <button className="border border-blood bg-blood px-4 py-3 font-display text-[11px] tracking-[0.2em] text-bone uppercase">
                Sync from Supabase
              </button>
            </form>
          ) : null
        }
      />
      <div className="mt-8 space-y-4">
        {users.length === 0 ? (
          <EmptyState
            title="No users"
            body="Create a login in Supabase Authentication, then sync."
          />
        ) : (
          users.map((user) => (
            <form key={user.id} action={saveUser} className="grid gap-2 border border-steel bg-obsidian p-4 md:grid-cols-6">
              <input type="hidden" name="id" value={user.id} />
              <input name="name" defaultValue={user.name} disabled={!canEdit} className="h-10 border border-steel bg-void px-3 text-sm" />
              <input name="email" defaultValue={user.email} disabled={!canEdit} className="h-10 border border-steel bg-void px-3 text-sm" />
              <select name="roleId" defaultValue={user.roleId} disabled={!canEdit} className="h-10 border border-steel bg-void px-3 text-sm">
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <select name="status" defaultValue={user.status} disabled={!canEdit} className="h-10 border border-steel bg-void px-3 text-sm">
                <option value="active">active</option>
                <option value="disabled">suspended</option>
              </select>
              <p className="flex items-center gap-2 text-xs text-ash">
                <span className="h-3 w-3 border border-steel" style={{ background: user.role.color }} />
                {user.role.name}
              </p>
              <div className="flex gap-2">
                {canEdit ? <button className="border border-blood px-3 text-xs uppercase">Save</button> : null}
                {canDelete ? (
                  <ConfirmButton
                    formAction={deleteUser.bind(null, user.id)}
                    message="Remove this account from Studio?"
                    className="min-h-11 text-xs uppercase text-ember"
                  >
                    Delete
                  </ConfirmButton>
                ) : null}
              </div>
            </form>
          ))
        )}
      </div>
    </main>
  );
}
