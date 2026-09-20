/** Site owners: full Founder access on hall (studio) and fan dashboards. */
export const SITE_OWNER_IDS = [
  "12ef6288-3691-4d2e-8f86-0102d413aff5",
  "d5a16ab4-021d-46b4-89c8-67a567dc8623",
] as const;

const OWNER_SET = new Set<string>(SITE_OWNER_IDS);

export function isSiteOwnerId(id?: string | null) {
  return Boolean(id && OWNER_SET.has(id));
}
