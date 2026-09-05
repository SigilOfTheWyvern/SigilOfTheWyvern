import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import { BagProvider } from "@/components/bag";
import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/catalog";
import { canAccessStudio, getAuthUser } from "@/lib/rbac";
import { setting } from "@/lib/site-copy";
import "./globals.css";

export const dynamic = "force-dynamic";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "SigilOfTheWyvern",
    template: "%s · SigilOfTheWyvern",
  },
  description:
    "Official site of SigilOfTheWyvern — blackened death metal. Music, tour, store, and rites.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, settings] = await Promise.all([getAuthUser(), getSiteSettings()]);
  const account = user
    ? {
        id: user.id,
        roleSlug: user.role.slug,
        studio: canAccessStudio(user),
        permissions: user.role.permissions.map(
          (permission) => `${permission.resource}:${permission.action}`,
        ),
      }
    : null;

  return (
    <html lang="en" className={`${cinzel.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-void font-body text-bone antialiased">
        <BagProvider ownerId={user?.id ?? null}>
          <div className="noise" aria-hidden />
          <div className="vignette" aria-hidden />
          <SiteShell
            account={account}
            year={setting(settings, "home.year")}
            footerBlurb={setting(settings, "footer.blurb")}
            siteName={setting(settings, "site.name", "SigilOfTheWyvern")}
            tourLabel={setting(settings, "home.tourLabel", "Tour Dates")}
          >
            {children}
          </SiteShell>
        </BagProvider>
      </body>
    </html>
  );
}
