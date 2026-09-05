import Link from "next/link";
import { navLinks } from "@/lib/data";

export function SiteFooter({
  year = "",
  blurb = "",
  siteName = "SigilOfTheWyvern",
}: {
  year?: string;
  blurb?: string;
  siteName?: string;
}) {
  return (
    <footer className="relative z-10 border-t border-steel bg-obsidian">
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
          </div>

          <div>
            <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
              Navigate
            </p>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ash transition-colors hover:text-blood"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
              More
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ash">
              <li>
                <Link href="/news" className="hover:text-blood">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blood">
                  Booking & Press
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-blood">
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
