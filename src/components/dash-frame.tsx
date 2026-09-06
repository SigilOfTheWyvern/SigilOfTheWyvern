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
    <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-4" aria-label="Hall">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="pb-2 font-display text-[10px] tracking-[0.22em] text-ash uppercase">
            {group.label}
          </p>
          <div className="flex flex-col gap-2">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-11 shrink-0 items-center border px-3 font-display text-[11px] tracking-[0.18em] uppercase ${
                    active
                      ? "border-blood bg-blood text-bone"
                      : "border-steel text-mist hover:border-blood hover:text-bone"
                  }`}
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
    <div className="relative z-10 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-void lg:flex-row">
      <aside className="flex h-16 w-full shrink-0 items-center justify-between border-b border-steel bg-obsidian px-5 lg:h-full lg:w-60 lg:flex-col lg:items-stretch lg:border-r lg:border-b-0 lg:px-0">
        <div className="flex min-w-0 items-center justify-between gap-3 lg:px-5 lg:py-5">
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
      </aside>
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
      <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-8">
        <section className="mx-auto max-w-4xl">{children}</section>
      </div>
    </div>
  );
}
