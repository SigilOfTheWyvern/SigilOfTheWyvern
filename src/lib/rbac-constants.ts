export const RESOURCES = [
  "studio",
  "analytics",
  "pages",
  "music",
  "merch",
  "tickets",
  "tour",
  "news",
  "media",
  "band",
  "users",
  "roles",
  "orders",
  "cms",
  "settings",
  "audit",
  "inbox",
  "fan",
] as const;

export const ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "publish",
  "upload",
  "reorder",
  "manage",
] as const;

export type Resource = (typeof RESOURCES)[number];
export type Action = (typeof ACTIONS)[number];

export const HALL_ROLE_SLUGS = ["founder", "developer", "band-member", "fan"] as const;
export const PRIVILEGED_SLUGS = ["founder", "developer"] as const;

export function isPrivilegedSlug(slug?: string | null) {
  return Boolean(slug && (PRIVILEGED_SLUGS as readonly string[]).includes(slug));
}

export const PERMISSION_GROUPS = [
  { id: "dashboard", label: "Dashboard", resources: ["studio", "analytics"] as const },
  { id: "users", label: "Users", resources: ["users"] as const },
  { id: "roles", label: "Roles", resources: ["roles"] as const },
  { id: "tickets", label: "Tickets", resources: ["tickets"] as const },
  { id: "events", label: "Events", resources: ["tour"] as const },
  { id: "merch", label: "Merch", resources: ["merch", "orders"] as const },
  { id: "media", label: "Media", resources: ["media"] as const },
  { id: "content", label: "Content", resources: ["pages", "news", "cms", "music", "band"] as const },
  { id: "hall", label: "Hall", resources: ["fan"] as const },
  { id: "settings", label: "Settings", resources: ["settings"] as const },
  { id: "inbox", label: "Inbox", resources: ["inbox"] as const },
  { id: "audit", label: "Audit", resources: ["audit"] as const },
] as const;

export const ACTION_LABELS: Record<Action, string> = {
  view: "View",
  create: "Add",
  edit: "Change",
  delete: "Delete",
  publish: "Publish",
  upload: "Upload",
  reorder: "Reorder",
  manage: "Full control",
};

export const RESOURCE_LABELS: Record<Resource, string> = {
  studio: "Studio home",
  analytics: "Counts",
  pages: "Homepage blocks",
  music: "Music",
  merch: "Merch",
  tickets: "Tickets",
  tour: "Tour",
  news: "News",
  media: "Media",
  band: "Band",
  users: "Users",
  roles: "Roles",
  orders: "Orders",
  cms: "Content",
  settings: "Settings",
  audit: "Audit",
  inbox: "Inbox",
  fan: "Fan hall",
};

export const ALL_PERMISSION_KEYS = RESOURCES.flatMap((resource) =>
  ACTIONS.map((action) => `${resource}:${action}`),
);

export const ROLE_COLORS = [
  "#c4a574",
  "#e11d26",
  "#e8e2da",
  "#8c8884",
  "#b8b3ad",
  "#8f1218",
  "#3f3f3f",
  "#d6c4a0",
] as const;
