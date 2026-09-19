import Link from "next/link";
import { DEFAULT_NAV } from "@/lib/nav";

export function SiteFooter({
  year = "",
  blurb = "",
  siteName = "SigilOfTheWyvern",
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
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-12 text-center md:px-8 md:py-14">
        {year ? (
          <p className="font-display text-[10px] tracking-[0.4em] text-blood uppercase">
            {year}
          </p>
        ) : null}
        <p className="mt-3 font-display text-xl tracking-[0.14em] text-bone uppercase sm:text-2xl">
          {siteName}
        </p>
        {blurb ? (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ash">{blurb}</p>
        ) : null}

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {nav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center font-display text-[11px] tracking-[0.2em] text-mist uppercase transition-colors hover:text-blood"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {social.length ? (
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {social.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center border border-steel px-3 font-display text-[10px] tracking-[0.18em] text-ash uppercase hover:border-blood hover:text-bone"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-10 border-t border-steel pt-6 text-[11px] tracking-[0.16em] text-ash uppercase">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
