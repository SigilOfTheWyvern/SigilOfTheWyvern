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
  hasPermission(founder, "users", "delete"),
  hasPermission(editor, "news", "edit"),
  !hasPermission(editor, "users", "delete"),
  !hasPermission(fan, "studio", "view"),
  hasPermission(fan, "fan", "view"),
];

if (checks.some((item) => !item)) {
  throw new Error("RBAC checks failed");
}

console.log("rbac-ok");
