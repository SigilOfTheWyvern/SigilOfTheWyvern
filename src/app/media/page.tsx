import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState } from "@/components/dash-ui";
import { MediaGallery } from "@/components/media-gallery";
import { getPublishedPhotos, getPublishedVideos, getSiteSettings } from "@/lib/catalog";
import { setting } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media",
  description: "Videos, live cuts, and stills from SigilOfTheWyvern.",
};

export default async function MediaPage() {
  const [videos, photos, settings] = await Promise.all([
    getPublishedVideos(),
    getPublishedPhotos(),
    getSiteSettings(),
  ]);
  const [featured, ...rest] = videos;

  return (
    <main className="relative z-10 pt-24">
      <section className="bg-void">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">
            {setting(settings, "media.kicker", "Film")}
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-[0.1em] text-bone uppercase sm:text-5xl">
            {setting(settings, "media.title", "Media")}
          </h1>
          {!featured && photos.length === 0 ? (
            <div className="mt-10">
              <EmptyState title="No media yet" body="Published photos and films from Studio will show here." />
            </div>
          ) : null}
        </div>
        {featured ? (
          featured.embedUrl ? (
          <a
            href={featured.embedUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative mx-auto block aspect-[4/5] max-w-6xl overflow-hidden border-y border-steel sm:aspect-[16/9] lg:aspect-[16/8]"
          >
            {featured.imagePath ? (
              <Image
                src={featured.imagePath}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(225,29,38,0.28),#070707_70%)]" />
            )}
            <div className="relative flex h-full flex-col justify-end bg-gradient-to-t from-void via-void/40 to-transparent px-6 py-8 md:px-10">
              <span className="mb-4 flex h-12 w-12 items-center justify-center border border-bone text-bone sm:mb-6 sm:h-16 sm:w-16">
                ▶
              </span>
              <p className="font-display text-[10px] tracking-[0.24em] text-blood uppercase">
                {featured.kind} · {featured.length}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-[0.08em] text-bone uppercase sm:text-3xl md:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm text-mist">{featured.note}</p>
            </div>
          </a>
          ) : (
          <div className="group relative mx-auto aspect-[4/5] max-w-6xl overflow-hidden border-y border-steel sm:aspect-[16/9] lg:aspect-[16/8]">
            {featured.imagePath ? (
              <Image
                src={featured.imagePath}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(225,29,38,0.28),#070707_70%)]" />
            )}
            <div className="relative flex h-full flex-col justify-end bg-gradient-to-t from-void via-void/40 to-transparent px-6 py-8 md:px-10">
              <p className="font-display text-[10px] tracking-[0.24em] text-blood uppercase">
                {featured.kind} · {featured.length}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-[0.08em] text-bone uppercase sm:text-3xl md:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm text-mist">{featured.note}</p>
            </div>
          </div>
          )
        ) : null}
      </section>

      {rest.length ? (
        <section className="overflow-hidden border-b border-steel bg-obsidian py-10">
          <p className="mb-6 px-5 font-display text-[11px] tracking-[0.28em] text-mist uppercase md:px-8">
            More film
          </p>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-8">
            {rest.map((video) => (
              <article key={video.slug} className="min-w-[17rem] snap-start border border-steel bg-void">
                {video.imagePath ? (
                  <div className="relative aspect-video">
                    <Image src={video.imagePath} alt={video.title} fill className="object-cover" sizes="260px" />
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">
                    {video.kind}
                  </p>
                  <h3 className="mt-3 font-display text-xl tracking-[0.06em] text-bone uppercase">
                    {video.title}
                  </h3>
                  <p className="mt-3 text-sm text-ash">
                    {video.year} · {video.length}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-mist">{video.note}</p>
                  {video.embedUrl ? (
                    <a
                      href={video.embedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center font-display text-[10px] tracking-[0.2em] text-blood uppercase"
                    >
                      Watch
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="mb-8 font-display text-[11px] tracking-[0.28em] text-mist uppercase">
          Stills
        </p>
        <MediaGallery photos={photos} />
      </section>
    </main>
  );
}
