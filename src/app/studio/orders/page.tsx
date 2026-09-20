import { setOrderStatus } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioOrdersPage() {
  const user = await requirePermission("orders", "view");
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 80,
  });
  const canManage = hasPermission(user, "orders", "manage") || hasPermission(user, "orders", "edit");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Sales" title="Orders" hint="Real checkouts only. Empty means nobody has purchased yet." />
      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <EmptyState title="No orders" body="No purchases are in the database." />
        ) : (
          orders.map((order) => (
            <article key={order.id} className="border border-steel bg-obsidian p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display uppercase text-bone">{order.id.slice(-8)}</p>
                  <p className="text-sm text-ash">
                    {order.user.email} · {money(order.totalCents)} · {order.createdAt.toISOString().slice(0, 10)}
                  </p>
                </div>
                {canManage ? (
                  <form action={setOrderStatus} className="flex w-full flex-wrap gap-2 sm:w-auto">
                    <input type="hidden" name="id" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      aria-label="Order status"
                      className="h-12 min-w-0 flex-1 border border-steel bg-void px-3 text-base sm:flex-none"
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="fulfilled">fulfilled</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button className="inline-flex min-h-12 items-center border border-blood px-4 text-xs uppercase">Update</button>
                  </form>
                ) : (
                  <p className="text-sm text-blood">{order.status}</p>
                )}
              </div>
              <ul className="mt-3 text-sm text-mist">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.label} × {item.qty}
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
