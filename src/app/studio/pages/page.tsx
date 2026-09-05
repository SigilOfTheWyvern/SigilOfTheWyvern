import { deleteSection, publishPage, reorderSection, saveSection } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { Field, SiteLinkSelect, areaClass, inputClass } from "@/components/easy-fields";
import { ImageUpload } from "@/components/image-upload";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioPagesPage() {
  const user = await requirePermission("pages", "view");
  const page = await prisma.sitePage.findUnique({
    where: { slug: "home" },
    include: { sections: { orderBy: { sort: "asc" } } },
  });
  const canCreate = hasPermission(user, "pages", "create");
  const canEdit = hasPermission(user, "pages", "edit");
  const canDelete = hasPermission(user, "pages", "delete");
  const canPublish = hasPermission(user, "pages", "publish");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Content"
        title="Pages"
        hint="Published home blocks appear on the public homepage with the same photo and copy."
        action={
          page && canPublish ? (
            <form action={publishPage.bind(null, page.id, page.status === "published" ? "draft" : "published")}>
              <button className="border border-blood px-4 py-2 text-xs uppercase">
                {page.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </form>
          ) : null
        }
      />
      {!page || page.sections.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No home blocks" body="Nothing extra is published under the news strip yet." />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <article key={section.id} className="grid gap-6 border border-steel bg-obsidian p-5 md:grid-cols-2">
              <div>
                <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">Public preview</p>
                {section.imagePath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={section.imagePath} alt="" className="mt-3 aspect-[4/3] w-full object-cover" />
                ) : null}
                <h3 className="mt-4 font-display text-2xl uppercase text-bone">{section.heading || "Untitled"}</h3>
                <p className="mt-3 text-sm leading-7 text-ash">{section.body}</p>
              </div>
              {canEdit ? (
                <div>
                  <form action={saveSection} className="grid gap-4">
                    <input type="hidden" name="id" value={section.id} />
                    <input type="hidden" name="pageId" value={page.id} />
                    <input type="hidden" name="type" value={section.type} />
                    <ImageUpload name="imagePath" defaultValue={section.imagePath ?? ""} label="Block photo" />
                    <Field label="Heading">
                      <input name="heading" defaultValue={section.heading ?? ""} className={inputClass} />
                    </Field>
                    <Field label="Body">
                      <textarea name="body" defaultValue={section.body ?? ""} className={areaClass} />
                    </Field>
                    <Field label="Button label" hint="Leave blank for no button.">
                      <input name="buttonLabel" defaultValue={section.buttonLabel ?? ""} className={inputClass} />
                    </Field>
                    <SiteLinkSelect defaultValue={section.buttonHref ?? ""} />
                    <label className="text-sm text-ash">
                      <input type="checkbox" name="published" defaultChecked={section.published} /> Show on homepage
                    </label>
                    <button className="w-fit border border-blood px-3 py-2 text-xs uppercase">Save block</button>
                  </form>
                  <div className="mt-3 flex gap-3">
                    <form action={reorderSection.bind(null, section.id, "up")}>
                      <button className="text-xs uppercase text-mist">Up</button>
                    </form>
                    <form action={reorderSection.bind(null, section.id, "down")}>
                      <button className="text-xs uppercase text-mist">Down</button>
                    </form>
                    {canDelete ? (
                      <form action={deleteSection.bind(null, section.id)}>
                        <button className="text-xs uppercase text-ember">Delete</button>
                      </form>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
      {page && canCreate ? (
        <form action={saveSection} className="mt-6 grid gap-4 border border-steel bg-obsidian p-5 md:grid-cols-2">
          <input type="hidden" name="pageId" value={page.id} />
          <input type="hidden" name="type" value="banner" />
          <ImageUpload name="imagePath" label="Block photo" />
          <div className="grid gap-4 content-start">
            <Field label="Heading">
              <input name="heading" className={inputClass} />
            </Field>
            <Field label="Body">
              <textarea name="body" className={areaClass} />
            </Field>
            <Field label="Button label">
              <input name="buttonLabel" className={inputClass} />
            </Field>
            <SiteLinkSelect />
            <button className="w-fit border border-blood bg-blood px-4 py-2 text-xs uppercase">Add homepage block</button>
          </div>
        </form>
      ) : null}
    </main>
  );
}
