import { deleteEvent, deleteTicketType, saveEvent, saveTicketType, saveTicketTypeUpdate } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { DollarInput, Field, TourStatusSelect, inputClass } from "@/components/easy-fields";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";
import { toLocalInput } from "@/lib/slug";

function statusLabel(status: string) {
  if (status === "sold_out") return "Sold out";
  if (status === "past") return "Past";
  return "On sale";
}

export default async function StudioTourPage() {
  const user = await requirePermission("tour", "view");
  const events = await prisma.event.findMany({ include: { ticketTypes: true }, orderBy: { date: "asc" } });
  const canCreate = hasPermission(user, "tour", "create");
  const canEdit = hasPermission(user, "tour", "edit");
  const canDelete = hasPermission(user, "tour", "delete");
  const canTicketCreate = hasPermission(user, "tickets", "create");
  const canTicketEdit = hasPermission(user, "tickets", "edit");
  const canTicketDelete = hasPermission(user, "tickets", "delete");
  const canPublish = hasPermission(user, "tour", "publish");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Events" title="Tour" hint="These dates are the public tour page. Pick a date and city. Price tickets in dollars." />
      {canCreate ? (
        <form action={saveEvent} className="mt-8 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-3">
          <Field label="Date and time">
            <input name="date" type="datetime-local" required className={inputClass} />
          </Field>
          <Field label="City">
            <input name="city" required className={inputClass} />
          </Field>
          <Field label="Venue">
            <input name="venue" required className={inputClass} />
          </Field>
          <Field label="Support" hint="Optional. Leave blank if headlining alone.">
            <input name="support" className={inputClass} />
          </Field>
          <TourStatusSelect />
          {canPublish ? (
            <label className="flex items-end gap-2 pb-3 text-sm text-ash">
              <input type="checkbox" name="published" defaultChecked /> Show on the public tour page
            </label>
          ) : null}
          <button className="h-11 border border-blood bg-blood px-4 py-2 text-xs uppercase">Create date</button>
        </form>
      ) : null}
      <div className="mt-8 space-y-5">
        {events.length === 0 ? (
          <EmptyState title="No dates" body="No tour dates are in the database." />
        ) : (
          events.map((event) => (
            <article key={event.id} className="border border-steel bg-obsidian p-5">
              <h2 className="font-display text-2xl uppercase text-bone">{event.city}</h2>
              <p className="text-sm text-ash">
                {event.venue} · {statusLabel(event.status)} · {event.published ? "Live" : "Hidden"}
              </p>
              {canEdit ? (
                <form action={saveEvent} className="mt-4 grid gap-4 md:grid-cols-3">
                  <input type="hidden" name="id" value={event.id} />
                  <Field label="Date and time">
                    <input name="date" type="datetime-local" defaultValue={toLocalInput(event.date)} className={inputClass} />
                  </Field>
                  <Field label="City">
                    <input name="city" defaultValue={event.city} className={inputClass} />
                  </Field>
                  <Field label="Venue">
                    <input name="venue" defaultValue={event.venue} className={inputClass} />
                  </Field>
                  <Field label="Support">
                    <input name="support" defaultValue={event.support ?? ""} className={inputClass} />
                  </Field>
                  <TourStatusSelect defaultValue={event.status} />
                  {canPublish ? (
                    <label className="flex items-end gap-2 pb-3 text-sm text-ash">
                      <input type="checkbox" name="published" defaultChecked={event.published} /> Show on the public tour page
                    </label>
                  ) : (
                    <input type="hidden" name="published" value={event.published ? "on" : ""} />
                  )}
                  <button className="h-11 border border-blood px-3 text-xs uppercase">Save</button>
                </form>
              ) : null}
              <p className="mt-5 font-display text-[10px] tracking-[0.18em] text-ash uppercase">Ticket types</p>
              <ul className="mt-2 space-y-2">
                {event.ticketTypes.map((type) => (
                  <li key={type.id}>
                    {canTicketEdit ? (
                      <form action={saveTicketTypeUpdate} className="grid gap-3 md:grid-cols-4">
                        <input type="hidden" name="id" value={type.id} />
                        <Field label="Name">
                          <input name="name" defaultValue={type.name} className={inputClass} />
                        </Field>
                        <DollarInput defaultCents={type.priceCents} />
                        <Field label="How many">
                          <input name="inventory" defaultValue={type.inventory} className={inputClass} />
                        </Field>
                        <div className="flex items-end gap-2 pb-1">
                          <button className="h-11 border border-steel px-3 text-xs uppercase">Save</button>
                          {canTicketDelete ? (
                            <button formAction={deleteTicketType.bind(null, type.id)} className="h-11 text-xs uppercase text-ember">
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-mist">
                        {type.name} · {money(type.priceCents)} · {type.inventory} left
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {canTicketCreate ? (
                <form action={saveTicketType} className="mt-4 grid gap-3 md:grid-cols-4">
                  <input type="hidden" name="eventId" value={event.id} />
                  <Field label="New ticket type">
                    <input name="name" className={inputClass} />
                  </Field>
                  <DollarInput />
                  <Field label="How many">
                    <input name="inventory" defaultValue={0} className={inputClass} />
                  </Field>
                  <button className="h-11 self-end border border-steel px-3 text-xs uppercase">Add ticket</button>
                </form>
              ) : null}
              {canDelete ? (
                <form action={deleteEvent.bind(null, event.id)} className="mt-3">
                  <button className="text-xs uppercase text-ember">Delete date</button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
