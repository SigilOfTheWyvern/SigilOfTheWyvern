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
  imagePath: string | null;
  role: {
    id: string;
    name: string;
    slug: string;
    color: string;
    permissions: { resource: string; action: string }[];
  };
};

const PRIVILEGED_SLUGS = new Set(["founder", "super-admin", "developer", "band-owner"]);

export function isPrivilegedSlug(slug?: string | null) {
  return Boolean(slug && PRIVILEGED_SLUGS.has(slug));
}

export function isFounder(user: AuthUser | null | undefined) {
  return isPrivilegedSlug(user?.role.slug);
}

export function canAccessFan(user: AuthUser | null | undefined) {
  return hasPermission(user, "fan", "view");
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
      imagePath: user.imagePath ?? null,
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

export type StudioNavLink = {
  href: string;
  label: string;
  resource: Resource;
  action: Action;
};

export type StudioNavGroup = {
  id: string;
  label: string;
  links: { href: string; label: string }[];
};

const STUDIO_NAV: { id: string; label: string; items: StudioNavLink[] }[] = [
  {
    id: "home",
    label: "Studio",
    items: [{ href: "/studio", label: "Overview", resource: "studio", action: "view" }],
  },
  {
    id: "website",
    label: "Website",
    items: [
      { href: "/studio/pages", label: "Pages", resource: "pages", action: "view" },
      { href: "/studio/settings", label: "Settings", resource: "settings", action: "view" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    items: [
      { href: "/studio/music", label: "Music", resource: "music", action: "view" },
      { href: "/studio/news", label: "News", resource: "news", action: "view" },
      { href: "/studio/band", label: "Band", resource: "band", action: "view" },
      { href: "/studio/media", label: "Media", resource: "media", action: "view" },
    ],
  },
  {
    id: "dates",
    label: "Dates",
    items: [
      { href: "/studio/tour", label: "Tour", resource: "tour", action: "view" },
      { href: "/studio/tickets", label: "Tickets", resource: "tickets", action: "view" },
    ],
  },
  {
    id: "store",
    label: "Store",
    items: [
      { href: "/studio/merch", label: "Merch", resource: "merch", action: "view" },
      { href: "/studio/orders", label: "Orders", resource: "orders", action: "view" },
    ],
  },
  {
    id: "access",
    label: "Access",
    items: [
      { href: "/studio/users", label: "Users", resource: "users", action: "view" },
      { href: "/studio/roles", label: "Roles", resource: "roles", action: "view" },
    ],
  },
  {
    id: "house",
    label: "House",
    items: [
      { href: "/studio/inbox", label: "Inbox", resource: "inbox", action: "view" },
      { href: "/studio/audit", label: "Audit", resource: "audit", action: "view" },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [{ href: "/studio/profile", label: "Profile", resource: "studio", action: "view" }],
  },
];

export function studioNav(user: AuthUser): StudioNavGroup[] {
  return STUDIO_NAV.map((group) => ({
    id: group.id,
    label: group.label,
    links: group.items
      .filter((item) => hasPermission(user, item.resource, item.action))
      .map(({ href, label }) => ({ href, label })),
  })).filter((group) => group.links.length > 0);
}
