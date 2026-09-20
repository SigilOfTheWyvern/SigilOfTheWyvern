import { ACTIONS, PRIVILEGED_SLUGS, RESOURCES } from "@/lib/rbac-constants";
import { prisma } from "@/lib/prisma";

function pairs(resource: string, actions: readonly string[]) {
  return actions.map((action) => ({ resource, action }));
}

const FULL_PERMS = RESOURCES.flatMap((resource) => pairs(resource, ACTIONS));

const HALL_ROLES = [
  {
    name: "Founder",
    slug: "founder",
    description: "Founder of the mark. Full control.",
    color: "#c4a574",
    perms: FULL_PERMS,
  },
  {
    name: "Developer",
    slug: "developer",
    description: "Builder of the seal. Same doors as Founder.",
    color: "#8f1218",
    perms: FULL_PERMS,
  },
  {
    name: "Super Admin",
    slug: "super-admin",
    description: "Full control of the seal.",
    color: "#e11d26",
    perms: FULL_PERMS,
  },
  {
    name: "Band Owner",
    slug: "band-owner",
    description: "Owner of the mark. Same doors as Founder.",
    color: "#d6c4a0",
    perms: FULL_PERMS,
  },
  {
    name: "Fan",
    slug: "fan",
    description: "The rite of the crowd.",
    color: "#e8e2da",
    perms: [
      ...pairs("fan", ["view", "edit"]),
      ...pairs("orders", ["view"]),
      ...pairs("tickets", ["view"]),
    ],
  },
];

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
    perms: FULL_PERMS,
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

const PRIVILEGED = new Set<string>(PRIVILEGED_SLUGS);

async function upsertRole(def: (typeof HALL_ROLES)[number], syncFullPerms: boolean) {
  const existing = await prisma.role.findUnique({
    where: { slug: def.slug },
    include: { permissions: true },
  });
  const role = existing
    ? existing
    : await prisma.role.create({
        data: {
          name: def.name,
          slug: def.slug,
          description: def.description,
          color: def.color,
          isSystem: true,
          permissions: { create: def.perms },
        },
        include: { permissions: true },
      });

  if (!syncFullPerms) return role;

  const have = new Set(role.permissions.map((permission) => `${permission.resource}:${permission.action}`));
  const missing = def.perms.filter((permission) => !have.has(`${permission.resource}:${permission.action}`));
  if (missing.length > 0) {
    await prisma.rolePermission.createMany({
      data: missing.map((permission) => ({
        roleId: role.id,
        resource: permission.resource,
        action: permission.action,
      })),
      skipDuplicates: true,
    });
  }
  return role;
}

export async function ensureHallRoles() {
  for (const def of HALL_ROLES) {
    await upsertRole(def, PRIVILEGED.has(def.slug));
  }
}

export async function ensureStudioHomePage() {
  await prisma.sitePage.upsert({
    where: { slug: "home" },
    update: {},
    create: { slug: "home", title: "Home", status: "published" },
  });
}

export async function ensureSystemRoles() {
  try {
    await ensureHallRoles();
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
  } catch (error) {
    console.error("ensureSystemRoles", error);
  }
}
