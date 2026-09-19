"use client";

import { toggleFavorite } from "@/actions/fan";

export function FavoriteButton({ productId, saved }: { productId: string; saved: boolean }) {
  return (
    <form action={toggleFavorite.bind(null, productId)}>
      <button type="submit" className="mt-2 inline-flex min-h-11 items-center font-display text-[10px] tracking-[0.2em] text-mist uppercase hover:text-blood">
        {saved ? "Remove from saved" : "Save relic"}
      </button>
    </form>
  );
}
