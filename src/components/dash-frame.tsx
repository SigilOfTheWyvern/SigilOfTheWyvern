"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/actions/auth";

type HallLink = { href: string; label: string };
type HallGroup = { id: string; label: string; links: HallLink[] };

export const fanGroups: HallGroup[] = [
  {
    id: "hall",
    label: "Hall",
    links: [{ href: "/fan", label: "Overview" }],
  },
  {
    id: "collection",
    label: "Collection",
    links: [
      { href: "/fan/orders", label: "Orders" },
      { href: "/fan/tickets", label: "Tickets" },
      { href: "/fan/saved", label: "Saved" },
      { href: "/fan/vault", label: "Vault" },
    ],
  },
  {
    id: "account",
    label: "Account",
    links: [
      { href: "/fan/notifications", label: "Notices" },
      { href: "/fan/profile", label: "Profile" },
    ],
  },
];

export const fanLinks: HallLink[] = fanGroups.flatMap((group) => group.links);

export function DashFrame({
  eyebrow,
  title,
  roleColor = "#e8e2da",
  links = fanLinks,
  children,
}: {
  eyebrow: string;
  title: string;
  roleColor?: string;
  links?: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.add("panel-lock");
    document.body.classList.add("panel-lock");
    return () => {
      document.documentElement.classList.remove("panel-lock");
      document.body.classList.remove("panel-lock");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups = fanGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => links.some((item) => item.href === link.href)),
    }))
    .filter((group) => group.links.length > 0);

  const nav = (
    <nav className="studio-nav-list !gap-3 !overflow-hidden px-4 py-3" aria-label="Hall">
      {groups.map((group) => (
        <div key={group.id} className="studio-nav-group">
          <p className="studio-nav-heading">{group.label}</p>
          <div className="studio-nav-links">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`studio-nav-link ${active ? "is-active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="relative z-10 h-full bg-void">
      <aside className={`hall-sidebar border-b border-steel bg-obsidian lg:border-r lg:border-b-0 ${open ? "bottom-0 !h-auto" : ""}`}>
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-5 lg:h-auto lg:py-5">
          <div className="min-w-0">
            <p className="font-display text-[10px] tracking-[0.28em] uppercase" style={{ color: roleColor }}>
              {eyebrow}
            </p>
            <h1 className="mt-1 truncate font-display text-xl tracking-[0.08em] text-bone uppercase sm:text-2xl">
              {title}
            </h1>
          </div>
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-steel text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="hall-mobile-nav"
            aria-label={open ? "Close hall menu" : "Open hall menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
        <div className="hidden min-h-0 flex-1 flex-col lg:flex">
          {nav}
          <form action={logoutAction} className="border-t border-steel p-5">
            <button
              type="submit"
              className="min-h-11 w-full border border-steel px-3 py-2 font-display text-[11px] tracking-[0.18em] text-mist uppercase hover:border-blood hover:text-bone"
            >
              Sign out
            </button>
          </form>
        </div>
        {open ? (
          <div
            id="hall-mobile-nav"
            className="absolute inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-obsidian lg:hidden"
          >
            {nav}
            <form action={logoutAction} className="border-t border-steel p-5">
              <button
                type="submit"
                className="min-h-11 w-full border border-steel px-3 py-2 font-display text-[11px] tracking-[0.18em] text-mist uppercase"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : null}
      </aside>
      <div className="h-full overflow-y-auto overscroll-contain px-5 pt-20 pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-8 lg:pl-72 lg:pt-8">
        <section className="mx-auto max-w-4xl">{children}</section>
      </div>
    </div>
  );
}
