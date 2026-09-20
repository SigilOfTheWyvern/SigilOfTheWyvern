import { isSiteOwner, isSiteOwnerEmail, isSiteOwnerId } from "../src/lib/owners";
import { hasPermission, isFounder, isPrivilegedSlug, type AuthUser } from "../src/lib/rbac";

const founder: AuthUser = {
  id: "1",
  email: "a@b.c",
  name: "F",
  status: "active",
  role: { id: "r", name: "Founder", slug: "founder", color: "#000", permissions: [] },
};
const editor: AuthUser = {
  ...founder,
  id: "2",
  role: {
    id: "e",
    name: "Editor",
    slug: "editor",
    color: "#000",
    permissions: [{ resource: "news", action: "edit" }],
  },
};
const fan: AuthUser = {
  ...founder,
  id: "3",
  role: { id: "f", name: "Fan", slug: "fan", color: "#000", permissions: [] },
};

const checks = [
  isFounder(founder),
  isPrivilegedSlug("band-owner"),
  isSiteOwnerId("12ef6288-3691-4d2e-8f86-0102d413aff5"),
  isSiteOwnerId("d5a16ab4-021d-46b4-89c8-67a567dc8623"),
  isSiteOwnerEmail("diegoa@sotw.com"),
  isSiteOwnerEmail("DiegoA@sotw.com"),
  !isSiteOwnerId("00000000-0000-0000-0000-000000000000"),
  !isSiteOwnerEmail("fan@example.com"),
  hasPermission(founder, "users", "delete"),
  hasPermission(founder, "studio", "manage"),
  hasPermission(founder, "fan", "edit"),
  hasPermission(founder, "roles", "manage"),
  hasPermission(editor, "news", "edit"),
  !hasPermission(editor, "users", "delete"),
  !hasPermission(fan, "studio", "view"),
  hasPermission(fan, "fan", "view"),
];

if (checks.some((item) => !item)) {
  throw new Error("RBAC checks failed");
}

console.log("rbac-ok");
