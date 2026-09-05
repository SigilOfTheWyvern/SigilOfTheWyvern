import { deleteContactMessage, deleteSubscriber } from "@/actions/inbox";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioInboxPage() {
  const user = await requirePermission("inbox", "view");
  const [messages, subscribers] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.mailingSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const canDelete = hasPermission(user, "inbox", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Mail"
        title="Inbox"
        hint="Contact form messages and mailing-list signups from the public site."
      />
      <section className="mt-10">
        <h2 className="font-display text-xl uppercase text-bone">Messages</h2>
        {messages.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No messages" body="Nothing has been sent from the contact page yet." />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {messages.map((message) => (
              <article key={message.id} className="border border-steel bg-obsidian p-5">
                <p className="font-display uppercase text-bone">{message.subject}</p>
                <p className="mt-1 text-sm text-ash">
                  {message.name} · {message.email} · {message.createdAt.toLocaleString()}
                </p>
                <p className="mt-3 text-sm leading-7 text-mist">{message.body}</p>
                {canDelete ? (
                  <form action={deleteContactMessage.bind(null, message.id)} className="mt-3">
                    <button className="text-xs uppercase text-ember">Delete</button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="mt-12">
        <h2 className="font-display text-xl uppercase text-bone">Mailing list</h2>
        {subscribers.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No subscribers" body="No one has joined the list yet." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {subscribers.map((row) => (
              <li key={row.id} className="flex items-center justify-between border border-steel bg-obsidian px-4 py-3 text-sm">
                <span className="text-mist">{row.email}</span>
                {canDelete ? (
                  <form action={deleteSubscriber.bind(null, row.id)}>
                    <button className="text-xs uppercase text-ember">Remove</button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
