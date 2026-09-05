export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function dollarsToCents(raw: FormDataEntryValue | null) {
  const amount = Number(raw ?? 0);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return Math.round(amount * 100);
}

export function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

export function toLocalInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function catalogImage(path?: string | null) {
  if (!path || path === "/logo.png") return null;
  return path;
}

export const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/tour", label: "Tour" },
  { href: "/store", label: "Store" },
  { href: "/media", label: "Media" },
  { href: "/band", label: "Band" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
] as const;
