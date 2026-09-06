"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/actions/auth";
import type { StudioNavGroup } from "@/lib/rbac";

function asGroups(
  groups?: StudioNavGroup[],
  links?: StudioNavGroup[] | { href: string; label: string }[],
): StudioNavGroup[] {
  const source = groups ?? links ?? [];
  if (!Array.isArray(source) || source.length === 0) return [];
  if (source.some((item) => item && "links" in item && Array.isArray(item.links))) {
    return source.filter((item): item is StudioNavGroup => Boolean(item && "links" in item));
  }
  return [
    {
      id: "studio",
      label: "Studio",
      links: source
        .filter((item): item is { href: string; label: string } => Boolean(item && "href" in item))
        .map((item) => ({ href: item.href, label: item.label })),
    },
  ];
}

export function StudioNav({
  role,
  roleColor,
  groups,
  links,
}: {
  role: string;
  roleColor: string;
  groups?: StudioNavGroup[];
  links?: StudioNavGroup[] | { href: string; label: string }[];
}) {
  const sections = asGroups(groups, links);
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

  const nav = (
    <nav className="studio-nav-list" aria-label="Studio">
      {sections.map((group) => (
        <div key={group.id} className="studio-nav-group">
          <p className="studio-nav-heading">{group.label}</p>
          <div className="studio-nav-links">
            {group.links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/studio" && pathname.startsWith(link.href));
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
    <aside className={`studio-sidebar ${open ? "is-open" : ""}`}>
      <div className="studio-sidebar-head">
        <div className="min-w-0">
          <p className="font-display text-[9px] tracking-[0.28em] uppercase" style={{ color: roleColor }}>
            Backstage
          </p>
          <p className="font-display text-base tracking-[0.08em] text-[#f0ebe3] uppercase">
            Studio
          </p>
          <p className="truncate text-[11px] text-[#8d8680]">{role}</p>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#2a3038] text-[#f0ebe3] lg:hidden"
          aria-expanded={open}
          aria-controls="studio-mobile-nav"
          aria-label={open ? "Close studio menu" : "Open studio menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "×" : "☰"}
        </button>
      </div>
      <div className="studio-sidebar-body" id="studio-mobile-nav">
        {nav}
        <div className="studio-sidebar-foot">
          <Link href="/" className="studio-nav-link" style={{ color: roleColor }}>
            View site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="studio-nav-link text-[#8d8680]">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
