import Link from "next/link";
import { DashFrame, fanLinks } from "@/components/dash-frame";
import { EmptyState } from "@/components/dash-ui";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanSavedPage() {
  const user = await requireUser();
  const saved = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  return (
    <DashFrame eyebrow="Fan hall" title="Saved" roleColor={user.role.color} links={fanLinks}>
      {saved.length === 0 ? (
        <EmptyState
          title="Nothing saved"
          body="Relics you keep from the store will list here."
          href="/store"
          label="Open store"
        />
      ) : (
        <div className="space-y-3">
          {saved.map((item) => (
            <Link
              key={item.id}
              href={`/store/${item.product.slug}`}
              className="flex justify-between border border-steel bg-obsidian px-5 py-4 hover:border-blood"
            >
              <span className="font-display uppercase text-bone">{item.product.name}</span>
              <span className="text-sm text-ash">{money(item.product.priceCents)}</span>
            </Link>
          ))}
        </div>
      )}
    </DashFrame>
  );
}
