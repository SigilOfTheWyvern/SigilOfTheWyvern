import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddTicket } from "@/components/add-ticket";
import { getPublishedEvent } from "@/lib/catalog";
import { money } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tickets" };

export default async function EventTicketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getPublishedEvent(id);
  if (!event) notFound();

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-5 pt-28 pb-20 md:px-8">
      <Link href="/tour" className="font-display text-[10px] tracking-[0.2em] text-mist uppercase hover:text-blood">
        ← Tour
      </Link>
      <p className="mt-6 font-display text-[11px] tracking-[0.28em] text-blood uppercase">
        {event.date.toUTCString().slice(0, 16)}
      </p>
      <h1 className="mt-3 font-display text-5xl uppercase text-bone">{event.city}</h1>
      <p className="mt-3 text-sm text-ash">
        {event.venue}
        {event.support ? ` · w/ ${event.support}` : ""}
      </p>
      {event.status !== "on_sale" ? (
        <p className="mt-8 text-sm text-ash">This rite is closed.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {event.ticketTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between border border-steel px-5 py-4">
              <div>
                <p className="font-display uppercase text-bone">{type.name}</p>
                <p className="text-sm text-ash">
                  {money(type.priceCents)} · {type.inventory} left
                </p>
              </div>
              <AddTicket
                eventCity={event.city}
                ticketTypeId={type.id}
                name={type.name}
                priceCents={type.priceCents}
                soldOut={type.inventory < 1}
              />
            </div>
          ))}
          <p className="text-xs text-ash">A fan account is required at checkout.</p>
        </div>
      )}
    </main>
  );
}
