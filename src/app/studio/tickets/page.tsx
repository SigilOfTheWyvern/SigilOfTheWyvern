import { deleteTicketType, saveTicketType, saveTicketTypeUpdate } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { DollarInput, Field, inputClass } from "@/components/easy-fields";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioTicketsPage() {
  const user = await requirePermission("tickets", "view");
  const [types, events] = await Promise.all([
    prisma.ticketType.findMany({
      include: { event: true, tickets: true },
      orderBy: { name: "asc" },
    }),
    prisma.event.findMany({ orderBy: { date: "asc" } }),
  ]);
  const canCreate = hasPermission(user, "tickets", "create");
  const canEdit = hasPermission(user, "tickets", "edit");
  const canDelete = hasPermission(user, "tickets", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Tickets"
        title="Inventory"
        hint="Add a ticket type to a tour date. Prices are in dollars. Sold counts are real tickets issued to accounts."
      />
      {canCreate ? (
        <form action={saveTicketType} className="mt-8 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-4">
          <p className="font-display text-[10px] tracking-[0.18em] text-blood uppercase md:col-span-4">
            Add a ticket
          </p>
          {events.length === 0 ? (
            <p className="text-sm text-ash md:col-span-4">
              Add a tour date first. Tickets belong to a city and venue.
            </p>
          ) : (
            <>
              <Field label="Tour date">
                <select name="eventId" required className={inputClass}>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.city} · {event.venue} · {event.date.toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ticket name">
                <input name="name" required className={inputClass} />
              </Field>
              <DollarInput />
              <Field label="How many">
                <input name="inventory" defaultValue={0} className={inputClass} />
              </Field>
              <button className="h-11 self-end border border-blood bg-blood px-4 text-xs uppercase">
                Add ticket
              </button>
            </>
          )}
        </form>
      ) : null}
      {types.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No ticket types" body="Nothing is on sale until a ticket is added." />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {types.map((type) => (
            <article key={type.id} className="border border-steel bg-obsidian p-5">
              <p className="font-display text-xl uppercase text-bone">{type.event.city}</p>
              <p className="mt-1 text-sm text-ash">
                {type.event.venue} · {money(type.priceCents)} · {type.inventory} left · {type.tickets.length} sold
              </p>
              {canEdit ? (
                <form action={saveTicketTypeUpdate} className="mt-4 grid gap-4 md:grid-cols-4">
                  <input type="hidden" name="id" value={type.id} />
                  <Field label="Type">
                    <input name="name" defaultValue={type.name} className={inputClass} />
                  </Field>
                  <DollarInput defaultCents={type.priceCents} />
                  <Field label="How many">
                    <input name="inventory" defaultValue={type.inventory} className={inputClass} />
                  </Field>
                  <div className="flex items-end gap-3">
                    <button className="h-11 border border-blood px-3 text-xs uppercase">Save</button>
                    {canDelete ? (
                      <button formAction={deleteTicketType.bind(null, type.id)} className="h-11 text-xs uppercase text-ember">
                        Delete
                      </button>
                    ) : null}
                  </div>
                </form>
              ) : (
                <p className="mt-3 text-sm text-mist">{type.name}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
