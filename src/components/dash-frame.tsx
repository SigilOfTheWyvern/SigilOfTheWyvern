"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <main className="relative z-10 min-h-screen bg-void pt-32">
      <aside className="sticky top-[6.5rem] z-30 border-y border-steel bg-obsidian lg:fixed lg:top-32 lg:bottom-0 lg:left-0 lg:flex lg:w-60 lg:flex-col lg:border-y-0 lg:border-r">
        <div className="px-5 py-5">
          <p className="font-display text-[10px] tracking-[0.28em] uppercase" style={{ color: roleColor }}>
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-2xl tracking-[0.08em] text-bone uppercase">
            {title}
          </h1>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-5 pb-4 lg:flex-1 lg:flex-col lg:overflow-y-auto" aria-label="Hall">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 border px-3 py-2 font-display text-[10px] tracking-[0.18em] uppercase ${
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
        <form action={logoutAction} className="border-t border-steel p-5">
          <button
            type="submit"
            className="w-full border border-steel px-3 py-2 font-display text-[10px] tracking-[0.18em] text-mist uppercase hover:border-blood hover:text-bone"
          >
            Sign out
          </button>
        </form>
      </aside>
      <div className="px-5 py-8 md:px-8 lg:pl-72">
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
