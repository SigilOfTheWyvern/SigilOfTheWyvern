import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/add-to-bag";
import { AlbumArt } from "@/components/album-art";
import { FavoriteButton } from "@/components/favorite-button";
import { getPublishedProduct, getPublishedProducts, money } from "@/lib/catalog";
import { catalogImage } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  return { title: product?.name ?? "Store", description: product?.blurb };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) notFound();

  const related = (await getPublishedProducts()).filter((item) => item.slug !== product.slug).slice(0, 3);
  const user = await getAuthUser();
  let saved = false;
  if (user) {
    try {
      saved = Boolean(
        await prisma.favorite.findUnique({
          where: { userId_productId: { userId: user.id, productId: product.id } },
        }),
      );
    } catch {
      saved = false;
    }
  }

  return (
    <main className="relative z-10 bg-void pt-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:gap-12 md:px-8">
        <AlbumArt
          title={product.kind}
          tone="from-blood/20 via-void to-steel/40"
          image={catalogImage(product.imagePath)}
          className="aspect-[4/5]"
        />
        <div>
          <Link href="/store" className="inline-flex min-h-11 items-center font-display text-[10px] tracking-[0.24em] text-mist uppercase hover:text-blood">
            ← Store
          </Link>
          <p className="mt-6 font-display text-[11px] tracking-[0.24em] text-blood uppercase">
            {product.kind} · {product.fabric}
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-[0.06em] text-bone uppercase sm:text-4xl md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-2xl text-mist">{money(product.priceCents)}</p>
          <p className="mt-6 max-w-md text-base leading-8 text-ash">{product.blurb}</p>
          <AddToBag
            name={product.name}
            variants={product.variants.map((variant) => ({
              id: variant.id,
              size: variant.size,
              inventory: variant.inventory,
              priceCents: variant.priceCents ?? product.priceCents,
            }))}
          />
          {user ? <FavoriteButton productId={product.id} saved={saved} /> : (
            <p className="mt-4 text-xs text-ash">Sign in to save relics and check out.</p>
          )}
        </div>
      </div>
      <section className="border-t border-steel bg-obsidian">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <p className="font-display text-[11px] tracking-[0.24em] text-mist uppercase">Also in the seal</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/store/${item.slug}`} className="border border-steel p-5 hover:border-blood focus-visible:border-blood">
                <p className="text-xs text-ash uppercase">{item.kind}</p>
                <h2 className="mt-2 font-display text-xl uppercase text-bone">{item.name}</h2>
                <p className="mt-3 text-sm text-mist">{money(item.priceCents)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
