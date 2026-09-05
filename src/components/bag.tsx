"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { money } from "@/lib/money";

export type BagLine = {
  id: string;
  kind: "merch" | "ticket";
  name: string;
  size: string;
  qty: number;
  priceCents: number;
  variantId?: string;
  ticketTypeId?: string;
};

type BagContextValue = {
  ownerId: string | null;
  items: BagLine[];
  count: number;
  totalCents: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<BagLine, "id" | "qty">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

function storageKey(ownerId: string) {
  return `sigil-bag:${ownerId}`;
}

export function BagProvider({
  ownerId,
  children,
}: {
  ownerId: string | null;
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<BagLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ownerId) {
      setItems([]);
      setReady(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(storageKey(ownerId));
      setItems(raw ? (JSON.parse(raw) as BagLine[]) : []);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, [ownerId]);

  useEffect(() => {
    if (!ready || !ownerId) return;
    window.localStorage.setItem(storageKey(ownerId), JSON.stringify(items));
  }, [items, ownerId, ready]);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);

    function add(item: Omit<BagLine, "id" | "qty">) {
      if (!ownerId) {
        window.location.href = "/login?next=/store";
        return;
      }
      setItems((current) => {
        const existing = current.find(
          (line) =>
            line.kind === item.kind &&
            line.variantId === item.variantId &&
            line.ticketTypeId === item.ticketTypeId,
        );
        if (existing) {
          return current.map((line) =>
            line.id === existing.id ? { ...line, qty: line.qty + 1 } : line,
          );
        }
        return [...current, { ...item, id: `${item.kind}-${Date.now()}`, qty: 1 }];
      });
      setOpen(true);
    }

    function remove(id: string) {
      setItems((current) => current.filter((line) => line.id !== id));
    }

    function clear() {
      setItems([]);
    }

    return { ownerId, items, count, totalCents, open, setOpen, add, remove, clear };
  }, [items, open, ownerId]);

  return (
    <BagContext.Provider value={value}>
      {children}
      {ownerId ? <BagDrawer /> : null}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used within BagProvider");
  return context;
}

export function BagButton({ href = "/fan" }: { href?: string }) {
  const { count } = useBag();
  return (
    <Link
      href={href}
      className="relative hidden border border-steel px-3 py-2 font-display text-[10px] tracking-[0.22em] text-bone uppercase transition-colors hover:border-blood lg:inline-block"
    >
      Bag
      {count > 0 ? (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center bg-blood px-1 text-[10px] text-bone">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function BagDrawer() {
  const { items, totalCents, open, setOpen } = useBag();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-void/70"
        aria-label="Close bag"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-steel bg-obsidian">
        <div className="flex items-center justify-between border-b border-steel px-6 py-5">
          <p className="font-display text-sm tracking-[0.24em] text-bone uppercase">Your relics</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-display text-[10px] tracking-[0.2em] text-ash uppercase hover:text-blood"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="text-sm leading-7 text-ash">The bag is empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="border-b border-steel pb-4">
                  <p className="font-display text-sm tracking-[0.08em] text-bone uppercase">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-ash">
                    {item.size} · Qty {item.qty} · {money(item.priceCents * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-steel px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="tracking-[0.16em] text-ash uppercase">Total</span>
            <span className="font-display text-bone">{money(totalCents)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className="mt-4 block border border-blood bg-blood px-4 py-3 text-center font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:bg-ember"
          >
            Checkout
          </Link>
          <Link
            href="/fan"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center font-display text-[10px] tracking-[0.2em] text-mist uppercase hover:text-bone"
          >
            Open your hall
          </Link>
        </div>
      </aside>
    </div>
  );
}
