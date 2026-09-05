import { prisma } from "@/lib/prisma";

export type AuditChange = {
  field: string;
  from: string;
  to: string;
};

export type AuditMeta = {
  label?: string;
  changes?: AuditChange[];
  note?: string;
};

function printValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function diffRecords(before: unknown, after: unknown): AuditChange[] {
  const left = asRecord(before) ?? {};
  const right = asRecord(after) ?? {};
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const skip = new Set(["id", "createdAt", "updatedAt", "password", "role", "user", "permissions", "variants", "tracks", "ticketTypes", "tickets", "items", "sections"]);
  const changes: AuditChange[] = [];
  for (const key of keys) {
    if (skip.has(key)) continue;
    const from = printValue(left[key]);
    const to = printValue(right[key]);
    if (from !== to) changes.push({ field: key, from, to });
  }
  return changes;
}

export async function writeAudit(entry: {
  userId?: string | null;
  action: string;
  resource: string;
  targetId?: string | null;
  meta?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      userId: entry.userId ?? undefined,
      action: entry.action,
      resource: entry.resource,
      targetId: entry.targetId ?? undefined,
      meta: entry.meta ?? undefined,
    },
  });
}

export async function recordChange(entry: {
  userId?: string | null;
  action: string;
  resource: string;
  targetId?: string | null;
  label?: string;
  before?: unknown;
  after?: unknown;
  note?: string;
}) {
  const changes = diffRecords(entry.before ?? null, entry.after ?? null);
  const meta: AuditMeta = {
    label: entry.label,
    changes,
    note: entry.note,
  };
  await writeAudit({
    userId: entry.userId,
    action: entry.action,
    resource: entry.resource,
    targetId: entry.targetId,
    meta: JSON.stringify(meta),
  });
}

export function parseAuditMeta(raw: string | null | undefined): AuditMeta {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as AuditMeta | string;
    if (typeof parsed === "string") return { note: parsed };
    return parsed;
  } catch {
    return { note: raw };
  }
}

export const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  edit: "Updated",
  delete: "Deleted",
  publish: "Publish change",
  upload: "Uploaded a photo",
  reorder: "Reordered",
  manage: "Updated",
  denied: "Access denied",
  view: "Viewed",
};

export const RESOURCE_LABELS: Record<string, string> = {
  studio: "Studio",
  analytics: "Overview",
  pages: "Pages",
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
  fan: "Hall",
};

export function fieldLabel(field: string) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/Cents$/, "")
    .replace(/Path$/, " photo")
    .replace(/^./, (letter) => letter.toUpperCase());
}
