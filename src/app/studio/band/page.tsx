import { deleteMember, saveMember } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { Field, PublishSelect, areaClass, inputClass } from "@/components/easy-fields";
import { ImageUpload } from "@/components/image-upload";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioBandPage() {
  const user = await requirePermission("band", "view");
  const members = await prisma.bandMember.findMany({ orderBy: { sort: "asc" } });
  const canCreate = hasPermission(user, "band", "create");
  const canEdit = hasPermission(user, "band", "edit");
  const canDelete = hasPermission(user, "band", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Lineup" title="Band" hint="Member photos and lines show on the public Band page." />
      {canCreate ? (
        <form action={saveMember} className="mt-8 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-2">
          <ImageUpload name="imagePath" label="Member photo" />
          <div className="grid gap-4">
            <Field label="Name">
              <input name="name" required className={inputClass} />
            </Field>
            <Field label="Role">
              <input name="role" required className={inputClass} />
            </Field>
            <Field label="Initial" hint="One letter shown if there is no photo.">
              <input name="mark" maxLength={2} className={inputClass} />
            </Field>
            <Field label="Order" hint="Lower numbers appear first.">
              <input name="sort" type="number" defaultValue={members.length + 1} className={inputClass} />
            </Field>
            <Field label="Line">
              <textarea name="line" className={areaClass} />
            </Field>
            <PublishSelect />
            <button className="border border-blood bg-blood px-4 py-2 text-xs uppercase">Add member</button>
          </div>
        </form>
      ) : null}
      <div className="mt-8 space-y-4">
        {members.length === 0 ? (
          <EmptyState title="No members" body="The lineup is empty until someone is added." />
        ) : (
          members.map((member) => (
            <article key={member.id} className="border border-steel bg-obsidian p-4">
              {canEdit ? (
                <form action={saveMember} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={member.id} />
                  <div className="md:col-span-2">
                    <ImageUpload name="imagePath" defaultValue={member.imagePath ?? ""} label="Member photo" />
                  </div>
                  <Field label="Name">
                    <input name="name" defaultValue={member.name} className={inputClass} />
                  </Field>
                  <Field label="Role">
                    <input name="role" defaultValue={member.role} className={inputClass} />
                  </Field>
                  <Field label="Initial">
                    <input name="mark" defaultValue={member.mark} className={inputClass} />
                  </Field>
                  <Field label="Order">
                    <input name="sort" defaultValue={member.sort} className={inputClass} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Line">
                      <textarea name="line" defaultValue={member.line} className={areaClass} />
                    </Field>
                  </div>
                  <PublishSelect defaultValue={member.status} />
                  <button className="h-11 self-end border border-blood px-3 text-xs uppercase">Save</button>
                </form>
              ) : (
                <div>
                  <h2 className="font-display text-2xl uppercase text-bone">{member.name}</h2>
                  <p className="text-sm text-ash">{member.role}</p>
                </div>
              )}
              {canDelete ? (
                <form action={deleteMember.bind(null, member.id)} className="mt-3">
                  <button className="text-xs uppercase text-ember">Delete</button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
