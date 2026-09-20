import Image from "next/image";
import { DashFrame } from "@/components/dash-frame";
import { EmptyState } from "@/components/dash-ui";
import { prisma } from "@/lib/prisma";
import { ticketQr } from "@/lib/qr";
import { formatShowDate } from "@/lib/dates";
import { requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanTicketsPage() {
  const user = await requireUser();
  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    include: { event: true, ticketType: true },
    orderBy: { createdAt: "desc" },
  });
  const codes = await Promise.all(
    tickets.map(async (ticket) => ({
      id: ticket.id,
      qr: await ticketQr(ticket.code),
    })),
  );
  const qrs = Object.fromEntries(codes.map((item) => [item.id, item.qr]));

  return (
    <DashFrame kicker="Collection" title="Tickets">
      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets"
          body="No ticket codes are attached to this account."
          href="/tour"
          label="See tour dates"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="border border-steel bg-obsidian p-5">
              <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">
                {ticket.ticketType.name}
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase text-bone">{ticket.event.city}</h2>
              <p className="mt-2 text-sm text-ash">
                {ticket.event.venue} · {formatShowDate(ticket.event.date)}
              </p>
              <p className="mt-4 font-display text-xs tracking-[0.18em] text-mist">{ticket.code}</p>
              <Image
                src={qrs[ticket.id]}
                alt={`QR for ${ticket.code}`}
                width={220}
                height={220}
                className="mt-4 border border-steel"
                unoptimized
              />
            </article>
          ))}
        </div>
      )}
    </DashFrame>
  );
}
