"use client";

import { useBag } from "@/components/bag";

export function AddTicket({
  eventCity,
  ticketTypeId,
  name,
  priceCents,
  soldOut,
}: {
  eventCity: string;
  ticketTypeId: string;
  name: string;
  priceCents: number;
  soldOut: boolean;
}) {
  const { add } = useBag();
  if (soldOut) {
    return <span className="font-display text-[10px] tracking-[0.2em] text-ash uppercase">Sold out</span>;
  }

  return (
    <button
      type="button"
      onClick={() =>
        add({
          kind: "ticket",
          name: `${eventCity} · ${name}`,
          size: name,
          priceCents,
          ticketTypeId,
        })
      }
      className="inline-flex min-h-11 w-full shrink-0 items-center justify-center border border-blood px-4 py-2 font-display text-[10px] tracking-[0.2em] text-bone uppercase hover:bg-blood sm:w-auto"
    >
      Add ticket
    </button>
  );
}
