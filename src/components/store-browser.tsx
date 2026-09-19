"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlbumArt } from "@/components/album-art";
import { money } from "@/lib/money";

type ProductCard = {
  slug: string;
  name: string;
  kind: string;
  priceCents: number;
  imagePath?: string | null;
};

const filters = ["All", "Apparel", "Vinyl", "Audio", "Print", "Relic"] as const;

export function StoreBrowser({ products }: { products: ProductCard[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = useMemo(
    () => products.filter((product) => filter === "All" || product.kind === filter),
    [filter, products],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`min-h-11 border px-4 py-2 font-display text-[10px] tracking-[0.2em] uppercase ${
              filter === item
                ? "border-blood bg-blood text-bone"
                : "border-steel text-mist hover:border-blood"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-steel px-5 py-12 text-center text-sm text-ash">
          {products.length === 0
            ? "No relics are published yet."
            : "Nothing in this filter."}
        </p>
      ) : null}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <Link
            key={product.slug}
            href={`/store/${product.slug}`}
            className="group border border-steel bg-charcoal/40 transition-colors hover:border-blood focus-visible:border-blood"
          >
            <AlbumArt
              title={product.kind}
              tone="from-steel/30 via-void to-blood/10"
              image={product.imagePath}
              className="aspect-[4/5]"
            />
            <div className="border-t border-steel p-4">
              <p className="font-display text-[10px] tracking-[0.22em] text-ash uppercase">{product.kind}</p>
              <h2 className="mt-2 font-display text-lg tracking-[0.06em] text-bone uppercase group-hover:text-blood">
                {product.name}
              </h2>
              <p className="mt-3 text-sm text-mist">{money(product.priceCents)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
