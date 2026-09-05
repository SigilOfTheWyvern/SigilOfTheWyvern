"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";

export function StudioNav({
  role,
  roleColor,
  links,
}: {
  role: string;
  roleColor: string;
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-40 border-b border-[#2a3038] bg-[#101318] lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
      <div className="border-b border-[#2a3038] px-5 py-5">
        <p className="font-display text-[10px] tracking-[0.32em] uppercase" style={{ color: roleColor }}>
          Backstage
        </p>
        <p className="mt-2 font-display text-lg tracking-[0.08em] text-[#f0ebe3] uppercase">
          Studio
        </p>
        <p className="mt-2 text-xs text-[#8d8680]">{role}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-y-auto" aria-label="Studio">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/studio" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 px-3 py-2 font-display text-[11px] tracking-[0.16em] uppercase ${
                active
                  ? "bg-white/10 text-[#e8d7b0]"
                  : "text-[#9a938c] hover:bg-white/5 hover:text-[#f0ebe3]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-[#2a3038] p-4">
        <Link
          href="/"
          className="font-display text-[10px] tracking-[0.18em] uppercase hover:text-[#e8d7b0]"
          style={{ color: roleColor }}
        >
          View site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="font-display text-[10px] tracking-[0.18em] text-[#8d8680] uppercase hover:text-[#f0ebe3]"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
