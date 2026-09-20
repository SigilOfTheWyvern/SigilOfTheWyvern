import Link from "next/link";
import { DashFrame } from "@/components/dash-frame";
import { EmptyState } from "@/components/dash-ui";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanHomePage() {
  const user = await requireUser();
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let tickets = 0;
  let notices = 0;
  let saved = 0;
  let orderCount = 0;
  try {
    [orders, tickets, notices, saved, orderCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: true },
      }),
      prisma.ticket.count({ where: { userId: user.id } }),
      prisma.notification.count({ where: { userId: user.id, read: false } }),
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.order.count({ where: { userId: user.id } }),
    ]);
  } catch (error) {
    console.error("fan.home", error);
  }

  return (
    <DashFrame kicker="Fan hall" title="Overview">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={String(orderCount)} href="/fan/orders" />
        <Stat label="Tickets" value={String(tickets)} href="/fan/tickets" />
        <Stat label="Unread" value={String(notices)} href="/fan/notifications" />
      </div>
      <div className="mt-12">
        <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">Recent orders</p>
        {orders.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No orders yet"
              body="Nothing is attached to this account. Relics and tickets you buy will show here."
              href="/store"
              label="Open store"
            />
          </div>
        ) : (
          <ul className="dash-panel mt-4 divide-y divide-[rgba(232,226,218,0.1)]">
            {orders.map((order) => (
              <li key={order.id} className="flex justify-between px-5 py-4 text-sm">
                <span className="font-display tracking-[0.12em] text-mist">
                  {order.id.slice(-8).toUpperCase()}
                </span>
                <span className="text-ash">
                  {order.status} · {money(order.totalCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-8 text-sm text-ash">{saved} saved relics</p>
    </DashFrame>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="dash-panel block p-6">
      <p className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">{label}</p>
      <p className="mt-3 font-display text-4xl tracking-[0.02em] text-bone">{value}</p>
    </Link>
  );
}
