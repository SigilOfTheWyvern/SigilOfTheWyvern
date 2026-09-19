"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthMenu, AuthMenuMobile, type AuthAccount } from "@/components/auth-menu";
import { BagButton, useBag } from "@/components/bag";
import { DEFAULT_NAV } from "@/lib/nav";

export function SiteHeader({
  account,
  siteName = "SigilOfTheWyvern",
  tourLabel = "Tour Dates",
  nav = DEFAULT_NAV.map((item) => ({ href: item.href, label: item.label })),
}: {
  account: AuthAccount;
  siteName?: string;
  tourLabel?: string;
  nav?: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const { count } = useBag();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solid = pathname !== "/" || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        solid
          ? "border-b border-steel/80 bg-void/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.5rem] md:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3" aria-label={`${siteName} home`}>
          <span className="hidden h-px w-6 bg-blood sm:block" />
          <span className="max-w-[calc(100vw-6.5rem)] truncate font-display text-[11px] font-semibold tracking-[0.28em] text-bone uppercase">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Primary">
          {nav.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex min-h-11 items-center font-display text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  active ? "text-blood" : "text-mist hover:text-blood"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <AuthMenu account={account} />
          {account ? <BagButton href="/fan" /> : null}
          <Link
            href="/tour"
            className="inline-flex min-h-11 items-center border border-blood px-4 py-2 font-display text-[10px] tracking-[0.24em] text-bone uppercase transition-colors hover:bg-blood"
          >
            {tourLabel}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center border border-steel text-bone lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-bone transition-all ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-1.5 left-0 h-px w-full bg-bone transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-bone transition-all ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>
    </header>
    {open ? (
      <div
        id="mobile-nav"
        className="fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] bottom-0 z-40 overflow-y-auto border-t border-steel bg-void pb-[env(safe-area-inset-bottom)] md:top-[calc(4.5rem+env(safe-area-inset-top))] lg:hidden"
      >
        <nav className="flex min-h-full flex-col px-5 py-6" aria-label="Mobile">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-12 items-center border-b border-steel/70 font-display text-sm tracking-[0.28em] text-bone uppercase"
            >
              {link.label}
            </Link>
          ))}
          {account ? (
            <Link
              href="/fan"
              className="mt-6 inline-flex min-h-12 items-center justify-center border border-steel px-4 font-display text-[11px] tracking-[0.24em] text-bone uppercase"
            >
              Bag{count > 0 ? ` · ${count}` : ""}
            </Link>
          ) : null}
          <AuthMenuMobile account={account} />
          <Link
            href="/tour"
            className="mt-3 inline-flex min-h-12 items-center justify-center border border-blood px-4 font-display text-[11px] tracking-[0.24em] text-bone uppercase"
          >
            {tourLabel}
          </Link>
        </nav>
      </div>
    ) : null}
    </>
  );
}
