import Link from "next/link";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioHomePage() {
  const user = await requirePermission("studio", "view");
  const canAnalytics = hasPermission(user, "analytics", "view") || hasPermission(user, "studio", "view");
  let products = 0;
  let events = 0;
  let orders = 0;
  let users = 0;
  let photos = 0;
  if (canAnalytics) {
    try {
      [products, events, orders, users, photos] = await Promise.all([
        prisma.product.count(),
        prisma.event.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.photo.count({ where: { path: { not: null } } }),
      ]);
    } catch (error) {
      console.error("studio.home", error);
    }
  }

  const cards = (
    [
      ["Relics", products, "/studio/merch", "merch"],
      ["Dates", events, "/studio/tour", "tour"],
      ["Orders", orders, "/studio/orders", "orders"],
      ["Users", users, "/studio/users", "users"],
      ["Stills", photos, "/studio/media", "media"],
    ] as const
  ).filter(([, , , resource]) => hasPermission(user, resource, "view"));

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Studio"
        title="Overview"
        hint="Live counts from the database. Empty means nothing has been created yet."
      />
      {canAnalytics ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map(([label, value, href]) => (
            <Link key={label} href={href} className="border border-steel bg-obsidian p-5 hover:border-blood focus-visible:border-blood">
              <p className="font-display text-[10px] tracking-[0.2em] text-ash uppercase">{label}</p>
              <p className="mt-2 font-display text-3xl text-bone">{value}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState title="No analytics access" body="Your role can open Studio but cannot view these counts." />
        </div>
      )}
    </main>
  );
}
