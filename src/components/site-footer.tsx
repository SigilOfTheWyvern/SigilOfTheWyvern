import Link from "next/link";
import { DEFAULT_NAV } from "@/lib/nav";

export function SiteFooter({
  year = "",
  blurb = "",
  siteName = "SigilOfTheWyvern",
  moreLabel = "More",
  nav = DEFAULT_NAV.map((item) => ({ href: item.href, label: item.label })),
  social = [],
}: {
  year?: string;
  blurb?: string;
  siteName?: string;
  moreLabel?: string;
  nav?: { href: string; label: string }[];
  social?: { name: string; href: string }[];
}) {
  return (
    <footer className="relative z-10 border-t border-steel bg-obsidian pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {year ? (
              <p className="font-display text-xs tracking-[0.4em] text-blood uppercase">
                {year}
              </p>
            ) : null}
            <p className="mt-3 font-display text-2xl tracking-[0.12em] text-bone uppercase">
              {siteName}
            </p>
            {blurb ? (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ash">{blurb}</p>
            ) : null}
            {social.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {social.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center border border-steel px-3 font-display text-[10px] tracking-[0.18em] text-mist uppercase hover:border-blood hover:text-bone"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
              Navigate
            </p>
            <ul className="mt-4 space-y-1">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-ash transition-colors hover:text-blood"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
              {moreLabel}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-ash">
              <li>
                <Link href="/news" className="inline-flex min-h-11 items-center hover:text-blood">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex min-h-11 items-center hover:text-blood">
                  Booking & Press
                </Link>
              </li>
              <li>
                <Link href="/store" className="inline-flex min-h-11 items-center hover:text-blood">
                  Relics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-steel pt-6 text-[11px] tracking-[0.16em] text-ash uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Red · Black · Grey</p>
        </div>
      </div>
    </footer>
  );
}
