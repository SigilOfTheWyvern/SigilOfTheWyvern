"use client";

import { useState } from "react";
import { useBag } from "@/components/bag";

type Variant = { id: string; size: string; inventory: number; priceCents: number };

export function AddToBag({
  name,
  variants,
}: {
  name: string;
  variants: Variant[];
}) {
  const { add } = useBag();
  const available = variants.filter((variant) => variant.inventory > 0);
  const [variantId, setVariantId] = useState(available[0]?.id ?? "");
  const selected = variants.find((variant) => variant.id === variantId);

  if (!available.length) {
    return <p className="mt-8 text-sm text-ash">Sold out of the seal.</p>;
  }

  return (
    <div className="mt-8">
      <p className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">Size</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            disabled={variant.inventory < 1}
            onClick={() => setVariantId(variant.id)}
            className={`border px-3 py-2 font-display text-[11px] tracking-[0.16em] uppercase ${
              variantId === variant.id
                ? "border-blood bg-blood text-bone"
                : "border-steel text-mist hover:border-blood"
            } disabled:opacity-40`}
          >
            {variant.size}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          if (!selected) return;
          add({
            kind: "merch",
            name,
            size: selected.size,
            priceCents: selected.priceCents,
            variantId: selected.id,
          });
        }}
        className="mt-6 w-full border border-blood bg-blood px-6 py-3 font-display text-[11px] tracking-[0.24em] text-bone uppercase hover:bg-ember"
      >
        Add to bag
      </button>
    </div>
  );
}
