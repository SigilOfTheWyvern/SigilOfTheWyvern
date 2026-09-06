import { setting } from "@/lib/site-copy";

export const DEFAULT_NAV = [
  { href: "/music", key: "nav.music", label: "Music" },
  { href: "/tour", key: "nav.tour", label: "Tour" },
  { href: "/store", key: "nav.store", label: "Store" },
  { href: "/media", key: "nav.media", label: "Media" },
  { href: "/band", key: "nav.band", label: "Band" },
  { href: "/news", key: "nav.news", label: "News" },
  { href: "/contact", key: "nav.contact", label: "Contact" },
] as const;

export function publicNav(settings: Record<string, string>) {
  const hidden = new Set(
    setting(settings, "nav.hidden")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  return DEFAULT_NAV.filter((item) => !hidden.has(item.href)).map((item) => ({
    href: item.href,
    label: setting(settings, item.key, item.label),
  }));
}
