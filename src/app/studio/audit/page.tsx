import { DashHeader, EmptyState } from "@/components/dash-ui";
import { ACTION_LABELS, RESOURCE_LABELS, fieldLabel, parseAuditMeta } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export default async function StudioAuditPage() {
  await requirePermission("audit", "view");
  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 400,
  });

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Log"
        title="Audit"
        hint="Every saved change, upload, deletion, and denied door is listed here with what moved."
      />
      {logs.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No entries" body="Nothing has been logged yet." />
        </div>
      ) : (
        <ol className="mt-8 space-y-4">
          {logs.map((log) => {
            const meta = parseAuditMeta(log.meta);
            const action = ACTION_LABELS[log.action] ?? log.action;
            const resource = RESOURCE_LABELS[log.resource] ?? log.resource;
            const when = log.createdAt.toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            });
            return (
              <li key={log.id} className="border border-steel bg-obsidian p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-sm uppercase text-bone">
                      {action}
                      {meta.label ? ` · ${meta.label}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-ash">
                      {resource}
                      {log.targetId ? ` · ${log.targetId}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-mist">
                    {log.user?.email ?? log.user?.name ?? "System"} · {when}
                  </p>
                </div>
                {meta.note ? <p className="mt-3 text-sm text-ash">{meta.note}</p> : null}
                {meta.changes && meta.changes.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm">
                    {meta.changes.map((change) => (
                      <li key={`${log.id}-${change.field}`} className="grid gap-1 border-t border-steel/80 pt-2 md:grid-cols-[8rem_1fr]">
                        <span className="font-display text-[10px] tracking-[0.16em] text-blood uppercase">
                          {fieldLabel(change.field)}
                        </span>
                        <span className="break-all text-mist">
                          <span className="text-ash">{truncate(change.from)}</span>
                          <span className="mx-2 text-blood">→</span>
                          <span className="text-bone">{truncate(change.to)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : log.action === "denied" ? (
                  <p className="mt-3 text-sm text-ember">This account tried a door their role does not hold.</p>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}

function truncate(value: string) {
  return value.length > 240 ? `${value.slice(0, 237)}…` : value;
}
