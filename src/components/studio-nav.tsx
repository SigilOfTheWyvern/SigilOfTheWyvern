"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Studio">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/studio" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`min-h-11 shrink-0 px-3 py-3 font-display text-[11px] tracking-[0.16em] uppercase ${
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
  );

  return (
    <>
      <aside className="fixed inset-x-0 top-0 z-40 border-b border-[#2a3038] bg-[#101318] lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 border-b border-[#2a3038] px-5 py-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.32em] uppercase" style={{ color: roleColor }}>
              Backstage
            </p>
            <p className="mt-1 font-display text-lg tracking-[0.08em] text-[#f0ebe3] uppercase">
              Studio
            </p>
            <p className="mt-1 text-xs text-[#8d8680]">{role}</p>
          </div>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center border border-[#2a3038] text-[#f0ebe3] lg:hidden"
            aria-expanded={open}
            aria-controls="studio-mobile-nav"
            aria-label={open ? "Close studio menu" : "Open studio menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            {open ? "×" : "☰"}
          </button>
        </div>
        <div className="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">{nav}</div>
        <div className="hidden items-center justify-between gap-2 border-t border-[#2a3038] p-4 lg:flex">
          <Link
            href="/"
            className="min-h-11 font-display text-[10px] tracking-[0.18em] uppercase hover:text-[#e8d7b0]"
            style={{ color: roleColor }}
          >
            View site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="min-h-11 font-display text-[10px] tracking-[0.18em] text-[#8d8680] uppercase hover:text-[#f0ebe3]"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      {open ? (
        <div
          id="studio-mobile-nav"
          className="fixed inset-x-0 top-[4.75rem] bottom-0 z-50 flex flex-col bg-[#101318] lg:hidden"
        >
          {nav}
          <div className="flex items-center justify-between gap-2 border-t border-[#2a3038] p-4">
            <Link
              href="/"
              className="min-h-11 font-display text-[10px] tracking-[0.18em] uppercase"
              style={{ color: roleColor }}
            >
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="min-h-11 font-display text-[10px] tracking-[0.18em] text-[#8d8680] uppercase"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
