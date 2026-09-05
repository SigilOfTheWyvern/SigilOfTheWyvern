import type { Metadata } from "next";
import { StoreBrowser } from "@/components/store-browser";
import { getPublishedProducts, getSiteSettings } from "@/lib/catalog";
import { setting } from "@/lib/site-copy";
import { catalogImage } from "@/lib/slug";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Store",
  description: "Official SigilOfTheWyvern relics — apparel, vinyl, prints.",
};

export default async function StorePage() {
  const [products, settings] = await Promise.all([getPublishedProducts(), getSiteSettings()]);
  const intro = setting(settings, "store.intro");
  const kicker = setting(settings, "store.kicker", "Official relics");

  return (
    <main className="relative z-10 bg-charcoal pt-24">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <div className="flex flex-col justify-between gap-6 border-b border-steel pb-10 md:flex-row md:items-end">
          <div>
            <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">{kicker}</p>
            <h1 className="mt-4 font-display text-5xl tracking-[0.08em] text-bone uppercase">Store</h1>
          </div>
          {intro ? <p className="max-w-sm text-sm leading-7 text-ash">{intro}</p> : null}
        </div>
        <div className="pt-10">
          <StoreBrowser
            products={products.map((product) => ({
              slug: product.slug,
              name: product.name,
              kind: product.kind,
              priceCents: product.priceCents,
              imagePath: catalogImage(product.imagePath),
            }))}
          />
        </div>
      </div>
    </main>
  );
}
