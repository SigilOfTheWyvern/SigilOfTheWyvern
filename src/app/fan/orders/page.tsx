import { DashFrame } from "@/components/dash-frame";
import { EmptyState } from "@/components/dash-ui";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanOrdersPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashFrame kicker="Collection" title="Orders">
      {orders.length === 0 ? (
        <EmptyState
          title="No orders"
          body="This hall has no purchases yet. Checkout from the store or tour pages to see them here."
          href="/store"
          label="Browse relics"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order.id} className="border border-steel bg-obsidian p-6">
              <div className="flex justify-between gap-4">
                <p className="font-display text-sm tracking-[0.16em] text-bone uppercase">
                  {order.id.slice(-8)}
                </p>
                <p className="text-sm text-blood">{order.status}</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ash">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.label} · {item.qty} · {money(item.unitCents * item.qty)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-mist">Total {money(order.totalCents)}</p>
            </article>
          ))}
        </div>
      )}
    </DashFrame>
  );
}
