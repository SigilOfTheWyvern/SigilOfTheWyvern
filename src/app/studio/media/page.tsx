import { deletePhoto, deleteVideo, savePhoto, saveVideo } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { AutoSlug, Field, PublishSelect, areaClass, inputClass } from "@/components/easy-fields";
import { ImageUpload } from "@/components/image-upload";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioMediaPage() {
  const user = await requirePermission("media", "view");
  const [videos, photos] = await Promise.all([
    prisma.video.findMany({ orderBy: { year: "desc" } }),
    prisma.photo.findMany({ orderBy: { id: "desc" } }),
  ]);
  const canCreate = hasPermission(user, "media", "create");
  const canEdit = hasPermission(user, "media", "edit");
  const canDelete = hasPermission(user, "media", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Vault" title="Media" hint="Same stills and films as the public /media page." />

      <section className="mt-10">
        <h2 className="font-display text-xl uppercase text-bone">Stills</h2>
        <p className="mt-2 text-sm text-ash">These photos are the stills on /media.</p>
        {canCreate ? (
          <form action={savePhoto} className="mt-6 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-2">
            <p className="font-display text-[10px] tracking-[0.18em] text-blood uppercase md:col-span-2">
              Add a still
            </p>
            <ImageUpload name="imagePath" label="Still" />
            <div className="grid gap-4 content-start">
              <Field label="Caption" hint="Optional.">
                <input name="caption" className={inputClass} />
              </Field>
              <Field label="Place" hint="Optional.">
                <input name="place" className={inputClass} />
              </Field>
              <PublishSelect />
              <button className="w-fit border border-blood bg-blood px-4 py-2 text-xs uppercase">Add still</button>
            </div>
          </form>
        ) : null}
        {photos.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No stills" body="No photos have been uploaded yet." />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <article key={photo.id} className="border border-steel bg-obsidian">
                {photo.path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.path} alt={photo.caption} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-xs text-ash">Missing file</div>
                )}
                {canEdit ? (
                  <form action={savePhoto} className="grid gap-4 p-4">
                    <input type="hidden" name="id" value={photo.id} />
                    <ImageUpload name="imagePath" defaultValue={photo.path ?? ""} label="Replace" />
                    <Field label="Caption">
                      <input name="caption" defaultValue={photo.caption} className={inputClass} />
                    </Field>
                    <Field label="Place">
                      <input name="place" defaultValue={photo.place} className={inputClass} />
                    </Field>
                    <PublishSelect defaultValue={photo.status} />
                    <div className="flex gap-3">
                      <button className="border border-blood px-3 py-2 text-xs uppercase">Save</button>
                      {canDelete ? (
                        <button formAction={deletePhoto.bind(null, photo.id)} className="text-xs uppercase text-ember">
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </form>
                ) : (
                  <p className="p-4 text-sm text-ash">{[photo.caption, photo.place].filter(Boolean).join(" · ") || "Still"}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-xl uppercase text-bone">Film</h2>
        <p className="mt-2 text-sm text-ash">These films are the featured and extra videos on /media.</p>
        {canCreate ? (
          <form action={saveVideo} className="mt-6 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-2">
            <p className="font-display text-[10px] tracking-[0.18em] text-blood uppercase md:col-span-2">
              Add a film
            </p>
            <ImageUpload name="imagePath" label="Poster" />
            <div className="grid gap-4">
              <AutoSlug titleLabel="Title" />
              <Field label="Kind">
                <select name="kind" className={inputClass}>
                  <option>Official video</option>
                  <option>Live</option>
                  <option>Trailer</option>
                  <option>Documentary</option>
                </select>
              </Field>
              <Field label="Year">
                <input name="year" className={inputClass} />
              </Field>
              <Field label="Length">
                <input name="length" placeholder="4:12" className={inputClass} />
              </Field>
              <Field label="Watch link" hint="YouTube or Vimeo address. Leave blank if there is no film yet.">
                <input name="embedUrl" className={inputClass} />
              </Field>
              <Field label="Note">
                <textarea name="note" className={areaClass} />
              </Field>
              <PublishSelect />
              <button className="w-fit border border-blood bg-blood px-4 py-2 text-xs uppercase">Add video</button>
            </div>
          </form>
        ) : null}
        {videos.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No films" body="No videos have been published yet." />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {videos.map((video) => (
              <article key={video.id} className="border border-steel bg-obsidian p-4">
                {canEdit ? (
                  <form action={saveVideo} className="grid gap-4 md:grid-cols-[12rem_1fr]">
                    <ImageUpload name="imagePath" defaultValue={video.imagePath ?? ""} label="Poster" />
                    <div className="grid gap-4">
                      <input type="hidden" name="id" value={video.id} />
                      <input type="hidden" name="slug" value={video.slug} />
                      <Field label="Title">
                        <input name="title" defaultValue={video.title} className={inputClass} />
                      </Field>
                      <Field label="Kind">
                        <input name="kind" defaultValue={video.kind} className={inputClass} />
                      </Field>
                      <Field label="Year">
                        <input name="year" defaultValue={video.year} className={inputClass} />
                      </Field>
                      <Field label="Length">
                        <input name="length" defaultValue={video.length} className={inputClass} />
                      </Field>
                      <Field label="Watch link">
                        <input name="embedUrl" defaultValue={video.embedUrl ?? ""} className={inputClass} />
                      </Field>
                      <Field label="Note">
                        <textarea name="note" defaultValue={video.note} className={areaClass} />
                      </Field>
                      <PublishSelect defaultValue={video.status} />
                      <div className="flex gap-3">
                        <button className="w-fit border border-blood px-3 py-2 text-xs uppercase">Save</button>
                        {canDelete ? (
                          <button formAction={deleteVideo.bind(null, video.id)} className="text-xs uppercase text-ember">
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-mist">{video.title} · {video.year}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
