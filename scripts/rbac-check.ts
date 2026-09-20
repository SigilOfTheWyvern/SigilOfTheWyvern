import { ACTIONS, RESOURCES } from "../src/lib/rbac-constants";
import { isSiteOwner, isSiteOwnerId, isSuperAdminEmail } from "../src/lib/owners";
import { canAccessStudio, hasPermission, isFounder, isPrivilegedSlug, studioNav, type AuthUser } from "../src/lib/rbac";

process.env.SUPER_ADMIN_EMAIL = "owner-test@example.com";

function user(partial: Partial<AuthUser> & { role: AuthUser["role"] }): AuthUser {
  return {
    id: "1",
    email: "a@b.c",
    name: "F",
    status: "active",
    imagePath: null,
    ...partial,
  };
}

const founder = user({
  role: { id: "r", name: "Founder", slug: "founder", color: "#000", permissions: [] },
});
const developer = user({
  id: "dev",
  email: "developer@sotw.com",
  name: "Developer",
  role: { id: "d", name: "Developer", slug: "developer", color: "#000", permissions: [] },
});
const editor = user({
  id: "2",
  role: {
    id: "e",
    name: "Editor",
    slug: "editor",
    color: "#000",
    permissions: [{ resource: "news", action: "edit" }],
  },
});
const fan = user({
  id: "3",
  role: { id: "f", name: "Fan", slug: "fan", color: "#000", permissions: [] },
});

const studioResources = RESOURCES.filter((resource) => resource !== "fan");
const checks = [
  isFounder(founder),
  isFounder(developer),
  isPrivilegedSlug("band-owner"),
  isSiteOwnerId("12ef6288-3691-4d2e-8f86-0102d413aff5"),
  isSiteOwnerId("d5a16ab4-021d-46b4-89c8-67a567dc8623"),
  isSuperAdminEmail("owner-test@example.com"),
  isSuperAdminEmail("Owner-Test@example.com"),
  isSiteOwner({ id: "x", email: "owner-test@example.com" }),
  !isSiteOwnerId("00000000-0000-0000-0000-000000000000"),
  !isSuperAdminEmail("fan@example.com"),
  canAccessStudio(founder),
  canAccessStudio(developer),
  !canAccessStudio(fan),
  hasPermission(editor, "news", "edit"),
  !hasPermission(editor, "users", "delete"),
  !hasPermission(fan, "studio", "view"),
  hasPermission(fan, "fan", "view"),
  studioNav(founder).length >= 8,
  studioNav(developer).length >= 8,
  studioNav(founder).every((group) => group.links.length > 0),
  studioNav(developer).every((group) => group.links.length > 0),
  ...studioResources.flatMap((resource) =>
    ACTIONS.map((action) => hasPermission(founder, resource, action) && hasPermission(developer, resource, action)),
  ),
];

if (checks.some((item) => !item)) {
  throw new Error("RBAC checks failed");
}

console.log("rbac-ok");
