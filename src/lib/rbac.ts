import { redirect } from "next/navigation";
import { writeAudit } from "@/lib/audit";
import { ensureProfile } from "@/lib/profile";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Action, Resource } from "@/lib/rbac-constants";

export type { Action, Resource };
export { ACTIONS, RESOURCES } from "@/lib/rbac-constants";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  status: string;
  role: {
    id: string;
    name: string;
    slug: string;
    color: string;
    permissions: { resource: string; action: string }[];
  };
};

export function isFounder(user: AuthUser | null | undefined) {
  const slug = user?.role.slug;
  return slug === "founder" || slug === "super-admin" || slug === "developer";
}

export function canAccessStudio(user: AuthUser | null | undefined) {
  if (!user || user.status !== "active") return false;
  if (isFounder(user)) return true;
  if (user.role.slug === "fan") return false;
  return user.role.permissions.some(
    (permission) =>
      (permission.resource === "*" && permission.action === "*") ||
      (permission.resource === "studio" && permission.action === "manage") ||
      (permission.resource === "studio" && permission.action === "view"),
  );
}

export function hasPermission(
  user: AuthUser | null | undefined,
  resource: Resource,
  action: Action,
) {
  if (!user || user.status !== "active") return false;
  if (isFounder(user)) return true;
  if (user.role.slug === "fan" && resource === "fan" && (action === "view" || action === "edit")) {
    return true;
  }
  if (resource === "studio" && user.role.slug === "fan") return false;
  return user.role.permissions.some(
    (permission) =>
      (permission.resource === "*" && permission.action === "*") ||
      (permission.resource === resource && permission.action === "manage") ||
      (permission.resource === resource && permission.action === action),
  );
}

export async function getAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return null;
    const user = await ensureProfile(authUser);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      role: {
        id: user.role.id,
        name: user.role.name,
        slug: user.role.slug,
        color: user.role.color ?? "#c4a574",
        permissions: user.role.permissions.map((permission) => ({
          resource: permission.resource,
          action: permission.action,
        })),
      },
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getAuthUser();
  if (!user || user.status !== "active") {
    redirect("/login");
  }
  return user;
}

export async function requireStudio() {
  const user = await requireUser();
  if (!canAccessStudio(user)) {
    redirect("/fan");
  }
  return user;
}

export async function requirePermission(resource: Resource, action: Action) {
  const user = await requireUser();
  if (!hasPermission(user, resource, action)) {
    await writeAudit({
      userId: user.id,
      action: "denied",
      resource,
      meta: JSON.stringify({ needed: action }),
    });
    if (resource === "fan") {
      redirect(canAccessStudio(user) ? "/studio/forbidden" : "/");
    }
    if (!canAccessStudio(user)) {
      redirect("/fan");
    }
    redirect("/studio/forbidden");
  }
  return user;
}

export function studioNav(user: AuthUser) {
  const items = [
    { href: "/studio", label: "Overview", resource: "studio" as const, action: "view" as const },
    { href: "/studio/pages", label: "Pages", resource: "pages" as const, action: "view" as const },
    { href: "/studio/music", label: "Music", resource: "music" as const, action: "view" as const },
    { href: "/studio/tour", label: "Tour", resource: "tour" as const, action: "view" as const },
    { href: "/studio/merch", label: "Merch", resource: "merch" as const, action: "view" as const },
    { href: "/studio/tickets", label: "Tickets", resource: "tickets" as const, action: "view" as const },
    { href: "/studio/media", label: "Media", resource: "media" as const, action: "view" as const },
    { href: "/studio/news", label: "News", resource: "news" as const, action: "view" as const },
    { href: "/studio/band", label: "Band", resource: "band" as const, action: "view" as const },
    { href: "/studio/orders", label: "Orders", resource: "orders" as const, action: "view" as const },
    { href: "/studio/users", label: "Users", resource: "users" as const, action: "view" as const },
    { href: "/studio/roles", label: "Roles", resource: "roles" as const, action: "view" as const },
    { href: "/studio/settings", label: "Settings", resource: "settings" as const, action: "view" as const },
    { href: "/studio/inbox", label: "Inbox", resource: "inbox" as const, action: "view" as const },
    { href: "/studio/audit", label: "Audit", resource: "audit" as const, action: "view" as const },
  ];
  return items.filter((item) => hasPermission(user, item.resource, item.action));
}
