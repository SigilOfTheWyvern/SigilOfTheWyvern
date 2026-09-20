/** Site owners: full Founder access on hall (studio) and fan dashboards. */
export const SITE_OWNER_IDS = [
  "12ef6288-3691-4d2e-8f86-0102d413aff5",
  "d5a16ab4-021d-46b4-89c8-67a567dc8623",
] as const;

export const SITE_OWNER_EMAILS = ["diegoa@sotw.com"] as const;

const OWNER_IDS = new Set<string>(SITE_OWNER_IDS);
const OWNER_EMAILS = new Set<string>(SITE_OWNER_EMAILS);

export function isSiteOwnerId(id?: string | null) {
  return Boolean(id && OWNER_IDS.has(id));
}

export function isSiteOwnerEmail(email?: string | null) {
  return Boolean(email && OWNER_EMAILS.has(email.trim().toLowerCase()));
}

export function isSuperAdminEmail(email?: string | null) {
  const configured = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return false;
  return isSiteOwnerEmail(normalized) || Boolean(configured && normalized === configured);
}

export function isSiteOwner(user?: { id?: string | null; email?: string | null } | null) {
  return isSiteOwnerId(user?.id) || isSuperAdminEmail(user?.email);
}
