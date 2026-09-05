"use client";

import { toggleFavorite } from "@/actions/fan";

export function FavoriteButton({ productId, saved }: { productId: string; saved: boolean }) {
  return (
    <form action={toggleFavorite.bind(null, productId)}>
      <button type="submit" className="mt-4 font-display text-[10px] tracking-[0.2em] text-mist uppercase hover:text-blood">
        {saved ? "Remove from saved" : "Save relic"}
      </button>
    </form>
  );
}
