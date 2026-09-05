import { markNotificationsRead } from "@/actions/fan";
import { DashFrame, fanLinks } from "@/components/dash-frame";
import { EmptyState } from "@/components/dash-ui";
import { prisma } from "@/lib/prisma";
import { hasPermission, requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanNoticesPage() {
  const user = await requireUser();
  const canEdit = hasPermission(user, "fan", "edit");
  const notices = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashFrame eyebrow="Fan hall" title="Notices" roleColor={user.role.color} links={fanLinks}>
      {notices.length === 0 ? (
        <EmptyState title="No notices" body="Nothing has been sent to this account." />
      ) : (
        <>
          {canEdit ? (
            <form action={markNotificationsRead}>
              <button type="submit" className="mb-6 font-display text-[10px] tracking-[0.2em] text-blood uppercase">
                Mark all read
              </button>
            </form>
          ) : null}
          <ul className="space-y-4">
            {notices.map((notice) => (
              <li key={notice.id} className="border border-steel bg-obsidian p-5">
                <p className="font-display text-sm uppercase text-bone">{notice.title}</p>
                <p className="mt-2 text-sm text-ash">{notice.body}</p>
                {!notice.read ? <p className="mt-2 text-xs text-blood">Unread</p> : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </DashFrame>
  );
}
