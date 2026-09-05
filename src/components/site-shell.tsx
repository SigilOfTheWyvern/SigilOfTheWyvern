"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { AuthAccount } from "@/components/auth-menu";

export function SiteShell({
  account,
  year,
  footerBlurb,
  siteName,
  tourLabel,
  children,
}: {
  account: AuthAccount;
  year?: string;
  footerBlurb?: string;
  siteName?: string;
  tourLabel?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const studio = pathname.startsWith("/studio");
  const fan = pathname.startsWith("/fan");

  if (studio) {
    return <div className="studio-skin">{children}</div>;
  }

  return (
    <>
      <SiteHeader account={account} siteName={siteName} tourLabel={tourLabel} />
      {fan ? (
        <div className="fan-ribbon fixed inset-x-0 top-16 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 md:px-8">
            <p className="font-display text-[10px] tracking-[0.28em] text-bone uppercase">
              Fan hall · client account
            </p>
            <p className="font-display text-[10px] tracking-[0.18em] text-ash uppercase">
              Tickets, orders, and relics
            </p>
          </div>
        </div>
      ) : null}
      {children}
      {fan ? null : <SiteFooter year={year} blurb={footerBlurb} siteName={siteName} />}
    </>
  );
}
