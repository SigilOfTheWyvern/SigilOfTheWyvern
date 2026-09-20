import { ACTIONS, HALL_ROLE_SLUGS, PRIVILEGED_SLUGS, RESOURCES } from "@/lib/rbac-constants";
import { prisma } from "@/lib/prisma";

function pairs(resource: string, actions: readonly string[]) {
  return actions.map((action) => ({ resource, action }));
}

const FULL_PERMS = RESOURCES.flatMap((resource) => pairs(resource, ACTIONS));

const HALL_ROLES = [
  {
    name: "Founder",
    slug: "founder",
    description: "Founder of the mark. Full control of every door.",
    color: "#c4a574",
    perms: FULL_PERMS,
  },
  {
    name: "Developer",
    slug: "developer",
    description: "Builder of the seal. Same full control as Founder.",
    color: "#8f1218",
    perms: FULL_PERMS,
  },
  {
    name: "Band Member",
    slug: "band-member",
    description: "Sees Studio. Edits the band page. Views music, tour, media, and news.",
    color: "#d6c4a0",
    perms: [
      ...pairs("studio", ["view"]),
      ...pairs("band", ["view", "edit", "create", "upload"]),
      ...pairs("music", ["view"]),
      ...pairs("tour", ["view"]),
      ...pairs("media", ["view"]),
      ...pairs("news", ["view"]),
      ...pairs("fan", ["view", "edit"]),
    ],
  },
  {
    name: "Fan",
    slug: "fan",
    description: "The rite of the crowd. Fan hall only.",
    color: "#e8e2da",
    perms: [
      ...pairs("fan", ["view", "edit"]),
      ...pairs("orders", ["view"]),
      ...pairs("tickets", ["view"]),
    ],
  },
] as const;

const ALLOWED_SLUGS = new Set<string>(HALL_ROLE_SLUGS);
const PRIVILEGED = new Set<string>(PRIVILEGED_SLUGS);

async function syncPermissions(
  roleId: string,
  current: { id: string; resource: string; action: string }[],
  wanted: readonly { resource: string; action: string }[],
) {
  const have = new Set(current.map((permission) => `${permission.resource}:${permission.action}`));
  const wantedKeys = new Set(wanted.map((permission) => `${permission.resource}:${permission.action}`));
  const extraIds = current
    .filter((permission) => !wantedKeys.has(`${permission.resource}:${permission.action}`))
    .map((permission) => permission.id);
  const missing = wanted.filter((permission) => !have.has(`${permission.resource}:${permission.action}`));

  if (extraIds.length > 0) {
    await prisma.rolePermission.deleteMany({ where: { id: { in: extraIds } } });
  }
  if (missing.length > 0) {
    await prisma.rolePermission.createMany({
      data: missing.map((permission) => ({
        roleId,
        resource: permission.resource,
        action: permission.action,
      })),
      skipDuplicates: true,
    });
  }
}

async function upsertRole(def: (typeof HALL_ROLES)[number]) {
  const existing = await prisma.role.findUnique({
    where: { slug: def.slug },
    include: { permissions: true },
  });
  const role = existing
    ? await prisma.role.update({
        where: { id: existing.id },
        data: {
          name: def.name,
          description: def.description,
          color: def.color,
          isSystem: true,
        },
        include: { permissions: true },
      })
    : await prisma.role.create({
        data: {
          name: def.name,
          slug: def.slug,
          description: def.description,
          color: def.color,
          isSystem: true,
          permissions: { create: [...def.perms] },
        },
        include: { permissions: true },
      });

  await syncPermissions(role.id, role.permissions, def.perms);
  return role;
}

export async function ensureHallRoles() {
  for (const def of HALL_ROLES) {
    await upsertRole(def);
  }
}

export async function ensureStudioHomePage() {
  await prisma.sitePage.upsert({
    where: { slug: "home" },
    update: {},
    create: { slug: "home", title: "Home", status: "published" },
  });
}

export async function pruneExtraRoles() {
  const extras = await prisma.role.findMany({
    where: { slug: { notIn: [...ALLOWED_SLUGS] } },
  });
  if (extras.length === 0) return;
  const fan = await prisma.role.findUnique({ where: { slug: "fan" } });
  for (const extra of extras) {
    if (fan) {
      await prisma.user.updateMany({ where: { roleId: extra.id }, data: { roleId: fan.id } });
    }
    await prisma.role.delete({ where: { id: extra.id } });
  }
}

export async function ensureSystemRoles() {
  try {
    await ensureHallRoles();
    await pruneExtraRoles();
  } catch (error) {
    console.error("ensureSystemRoles", error);
  }
}

export function isHallRoleSlug(slug?: string | null) {
  return Boolean(slug && ALLOWED_SLUGS.has(slug));
}

export function isFullAccessRole(slug?: string | null) {
  return Boolean(slug && PRIVILEGED.has(slug));
}
