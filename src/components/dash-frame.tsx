"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/actions/auth";

export function DashFrame({
  eyebrow,
  title,
  roleColor = "#e8e2da",
  links,
  children,
}: {
  eyebrow: string;
  title: string;
  roleColor?: string;
  links: { href: string; label: string }[];
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

  const nav = (
    <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 pb-4" aria-label="Hall">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex min-h-11 shrink-0 items-center border px-3 py-2 font-display text-[11px] tracking-[0.18em] uppercase ${
              active
                ? "border-blood bg-blood text-bone"
                : "border-steel text-mist hover:border-blood hover:text-bone"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <main className="relative z-10 min-h-screen bg-void pt-[9.75rem] sm:pt-[12.25rem] lg:pt-32">
      <aside className="fixed inset-x-0 top-16 z-30 border-y border-steel bg-obsidian sm:top-[6.5rem] lg:top-32 lg:bottom-0 lg:left-0 lg:flex lg:w-60 lg:flex-col lg:border-y-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.28em] uppercase" style={{ color: roleColor }}>
              {eyebrow}
            </p>
            <h1 className="mt-1 truncate font-display text-xl tracking-[0.08em] text-bone uppercase sm:text-2xl">
              {title}
            </h1>
          </div>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center border border-steel text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="hall-mobile-nav"
            aria-label={open ? "Close hall menu" : "Open hall menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
        <div className="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
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
          className="fixed inset-x-0 top-[9.75rem] bottom-0 z-40 flex flex-col bg-obsidian sm:top-[12.25rem] lg:hidden"
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
      <div className="px-5 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-8 lg:pl-72">
        <section className="mx-auto max-w-4xl">{children}</section>
      </div>
    </main>
  );
}

export const fanLinks = [
  { href: "/fan", label: "Overview" },
  { href: "/fan/orders", label: "Orders" },
  { href: "/fan/tickets", label: "Tickets" },
  { href: "/fan/saved", label: "Saved" },
  { href: "/fan/notifications", label: "Notices" },
  { href: "/fan/profile", label: "Profile" },
  { href: "/fan/vault", label: "Vault" },
];
