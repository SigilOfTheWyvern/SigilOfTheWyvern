"use client";

import { useState } from "react";
import { startCheckout } from "@/actions/commerce";
import { useBag } from "@/components/bag";
import { money } from "@/lib/money";

export default function CheckoutPage() {
  const { items, totalCents, clear } = useBag();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-5 pt-28 pb-20 md:px-8">
      <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">Pay</p>
      <h1 className="mt-3 font-display text-3xl tracking-[0.08em] text-bone uppercase sm:text-4xl">Checkout</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-sm text-ash">The bag is empty. Return to the store or tour.</p>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-steel border border-steel">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-display text-sm tracking-[0.08em] text-bone uppercase">{item.name}</p>
                  <p className="mt-1 text-xs text-ash">
                    {item.size} · Qty {item.qty}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-mist">{money(item.priceCents * item.qty)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-display text-xl text-bone">Total {money(totalCents)}</p>
          {error ? <p className="mt-4 text-sm text-ember">{error}</p> : null}
          <button
            type="button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              const result = await startCheckout({
                lines: items.map((item) => ({
                  kind: item.kind,
                  variantId: item.variantId,
                  ticketTypeId: item.ticketTypeId,
                  qty: item.qty,
                })),
              });
              if (result?.error) {
                setError(result.error);
                setPending(false);
                return;
              }
              clear();
            }}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center border border-blood bg-blood px-8 py-3 font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:bg-ember disabled:opacity-50 sm:w-auto"
          >
            {pending ? "Sealing…" : "Pay and seal"}
          </button>
          <p className="mt-4 text-xs leading-6 text-ash">
            Prices and inventory are confirmed on the server. Stripe is used when configured.
          </p>
        </>
      )}
    </main>
  );
}
