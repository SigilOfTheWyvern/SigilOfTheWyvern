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
  moreLabel,
  nav,
  social,
  children,
}: {
  account: AuthAccount;
  year?: string;
  footerBlurb?: string;
  siteName?: string;
  tourLabel?: string;
  moreLabel?: string;
  nav?: { href: string; label: string }[];
  social?: { name: string; href: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const studio = pathname.startsWith("/studio");
  const fan = pathname.startsWith("/fan");

  if (studio) {
    return (
      <div className="studio-skin">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </div>
    );
  }

  return (
    <>
      <SiteHeader account={account} siteName={siteName} tourLabel={tourLabel} nav={nav} />
      <div id="main-content" tabIndex={-1} className={fan ? "hall-shell" : ""}>
        {children}
      </div>
      {fan ? null : (
        <SiteFooter
          year={year}
          blurb={footerBlurb}
          siteName={siteName}
          moreLabel={moreLabel}
          nav={nav}
          social={social}
        />
      )}
    </>
  );
}
