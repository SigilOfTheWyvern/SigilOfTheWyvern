import { deleteAlbum, deleteTrack, saveAlbum, saveTrack } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { AutoSlug, Field, PublishSelect, areaClass, inputClass } from "@/components/easy-fields";
import { ImageUpload } from "@/components/image-upload";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioMusicPage() {
  const user = await requirePermission("music", "view");
  const albums = await prisma.album.findMany({
    include: { tracks: { orderBy: { sort: "asc" } } },
    orderBy: { year: "desc" },
  });
  const canCreate = hasPermission(user, "music", "create");
  const canEdit = hasPermission(user, "music", "edit");
  const canDelete = hasPermission(user, "music", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Catalog" title="Music" hint="Covers, tracks, and credits appear on /music exactly as saved." />
      {canCreate ? (
        <form action={saveAlbum} className="mt-8 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-2">
          <ImageUpload name="imagePath" label="Cover photo" />
          <div className="grid gap-4">
            <AutoSlug titleLabel="Album title" />
            <Field label="Type">
              <select name="type" className={inputClass}>
                <option>Single</option>
                <option>EP</option>
                <option>Full Length</option>
              </select>
            </Field>
            <Field label="Year">
              <input name="year" className={inputClass} />
            </Field>
            <Field label="Length">
              <input name="duration" placeholder="41:08" className={inputClass} />
            </Field>
            <Field label="Label">
              <input name="label" className={inputClass} />
            </Field>
            <Field label="Recorded at">
              <input name="recorded" className={inputClass} />
            </Field>
            <Field label="Short note">
              <input name="note" className={inputClass} />
            </Field>
            <PublishSelect />
            <Field label="Summary">
              <textarea name="summary" className={areaClass} />
            </Field>
            <Field label="Lyrics / fragment">
              <textarea name="lyrics" className={areaClass} />
            </Field>
            <button className="border border-blood bg-blood px-4 py-2 text-xs uppercase">Create album</button>
          </div>
        </form>
      ) : null}
      <div className="mt-8 space-y-4">
        {albums.length === 0 ? (
          <EmptyState title="No albums" body="The catalog is empty until an album is created." />
        ) : (
          albums.map((album) => (
            <article key={album.id} className="grid gap-3 border border-steel bg-obsidian p-4">
              <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">
                {album.status === "published" ? "Live on /music" : "Draft"} · {album.title}
              </p>
              {canEdit ? (
                <form action={saveAlbum} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={album.id} />
                  <input type="hidden" name="slug" value={album.slug} />
                  <input type="hidden" name="tone" value={album.tone} />
                  <ImageUpload name="imagePath" defaultValue={album.imagePath ?? ""} label="Cover photo" />
                  <div className="grid gap-4">
                    <Field label="Album title">
                      <input name="title" defaultValue={album.title} className={inputClass} />
                    </Field>
                    <Field label="Type">
                      <input name="type" defaultValue={album.type} className={inputClass} />
                    </Field>
                    <Field label="Year">
                      <input name="year" defaultValue={album.year} className={inputClass} />
                    </Field>
                    <Field label="Length">
                      <input name="duration" defaultValue={album.duration} className={inputClass} />
                    </Field>
                    <Field label="Label">
                      <input name="label" defaultValue={album.label} className={inputClass} />
                    </Field>
                    <Field label="Recorded at">
                      <input name="recorded" defaultValue={album.recorded} className={inputClass} />
                    </Field>
                    <Field label="Short note">
                      <input name="note" defaultValue={album.note} className={inputClass} />
                    </Field>
                    <PublishSelect defaultValue={album.status} />
                    <Field label="Summary">
                      <textarea name="summary" defaultValue={album.summary} className={areaClass} />
                    </Field>
                    <Field label="Lyrics / fragment">
                      <textarea name="lyrics" defaultValue={album.lyrics} className={areaClass} />
                    </Field>
                    <button className="w-fit border border-blood px-3 py-2 text-xs uppercase">Save</button>
                  </div>
                </form>
              ) : (
                <div>
                  <h2 className="font-display text-2xl uppercase text-bone">{album.title}</h2>
                  <p className="text-sm text-ash">{album.year} · {album.type}</p>
                </div>
              )}
              <p className="font-display text-[10px] tracking-[0.18em] text-ash uppercase">Tracks</p>
              <ul className="space-y-1 text-sm text-ash">
                {album.tracks.map((track) => (
                  <li key={track.id} className="flex items-center justify-between gap-3">
                    <span>{track.title} · {track.duration}</span>
                    {canDelete ? (
                      <form action={deleteTrack.bind(null, track.id)}>
                        <button className="text-xs uppercase text-ember">Delete</button>
                      </form>
                    ) : null}
                  </li>
                ))}
              </ul>
              {canEdit ? (
                <form action={saveTrack} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="albumId" value={album.id} />
                  <Field label="Track title">
                    <input name="title" className={inputClass} />
                  </Field>
                  <Field label="Length">
                    <input name="duration" placeholder="3:41" className={`${inputClass} w-24`} />
                  </Field>
                  <button className="h-11 border border-steel px-3 text-xs uppercase">Add track</button>
                </form>
              ) : null}
              {canDelete ? (
                <form action={deleteAlbum.bind(null, album.id)}>
                  <button className="text-xs uppercase text-ember">Delete album</button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
