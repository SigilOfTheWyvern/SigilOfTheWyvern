import { ACTIONS, RESOURCES } from "@/lib/rbac-constants";
import { prisma } from "@/lib/prisma";

function pairs(resource: string, actions: readonly string[]) {
  return actions.map((action) => ({ resource, action }));
}

const EXTRA_ROLES = [
  {
    name: "Manager",
    slug: "manager",
    description: "Runs content, users, tickets, and orders. Cannot rewrite role law.",
    color: "#c4a574",
    perms: [
      ...pairs("studio", ["view", "manage"]),
      ...["pages", "music", "merch", "tickets", "tour", "news", "media", "band", "orders", "users", "cms", "settings", "inbox"].flatMap(
        (resource) => pairs(resource, ACTIONS),
      ),
      ...pairs("audit", ["view"]),
      ...pairs("fan", ["view"]),
    ],
  },
  {
    name: "Administrator",
    slug: "admin",
    description: "Runs Studio with assigned doors. Not the Founder.",
    color: "#e11d26",
    perms: RESOURCES.flatMap((resource) => pairs(resource, ACTIONS)),
  },
  {
    name: "Staff",
    slug: "staff",
    description: "Sees Studio and edits assigned content. Cannot publish or delete.",
    color: "#8c8884",
    perms: [
      ...pairs("studio", ["view"]),
      ...["pages", "news", "music", "band", "media", "tour", "tickets"].flatMap((resource) =>
        pairs(resource, ["view", "create", "edit"]),
      ),
    ],
  },
  {
    name: "Viewer",
    slug: "viewer",
    description: "View only. No edits.",
    color: "#b8b3ad",
    perms: [
      ...pairs("studio", ["view"]),
      ...["pages", "news", "music", "band", "media", "tour", "tickets", "merch", "orders", "inbox"].flatMap(
        (resource) => pairs(resource, ["view"]),
      ),
      ...pairs("fan", ["view"]),
    ],
  },
];

export async function ensureSystemRoles() {
  for (const def of EXTRA_ROLES) {
    const existing = await prisma.role.findUnique({ where: { slug: def.slug } });
    if (existing) continue;
    await prisma.role.create({
      data: {
        name: def.name,
        slug: def.slug,
        description: def.description,
        color: def.color,
        isSystem: true,
        permissions: { create: def.perms },
      },
    });
  }
}
