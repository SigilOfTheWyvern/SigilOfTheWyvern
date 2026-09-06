import type { Metadata } from "next";
import Link from "next/link";
import { AlbumArt } from "@/components/album-art";
import { EmptyState } from "@/components/dash-ui";
import { TrackPlayer } from "@/components/track-player";
import { getPublishedAlbums, getSiteSettings } from "@/lib/catalog";
import { musicPlatforms, setting } from "@/lib/site-copy";
import { catalogImage } from "@/lib/slug";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music",
  description: "Listen to SigilOfTheWyvern — singles, EP, and the Thorn Crown testament.",
};

export default async function MusicPage() {
  const [albums, settings] = await Promise.all([getPublishedAlbums(), getSiteSettings()]);
  const featured = albums[0];
  const intro = settings["music.intro"]?.trim() ?? "";
  const platforms = musicPlatforms(settings);

  return (
    <main className="relative z-10 pt-24">
      <div className="border-b border-steel bg-charcoal">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-20">
          <div>
            <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">
              Studio
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-[0.08em] text-bone uppercase sm:text-5xl md:text-6xl">
              {setting(settings, "music.title", "Music")}
            </h1>
            {intro ? <p className="mt-5 max-w-lg text-base leading-8 text-ash">{intro}</p> : null}
            {platforms.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {platforms.map((platform) => (
                  <Link
                    key={platform.name}
                    href={platform.href}
                    className="inline-flex min-h-11 items-center border border-steel px-4 py-2 font-display text-[10px] tracking-[0.2em] text-mist uppercase hover:border-blood hover:text-bone"
                  >
                    {platform.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {featured ? <TrackPlayer album={featured.title} tracks={featured.tracks} /> : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
          Discography
        </p>
        <div className="mt-8 space-y-4">
          {albums.length === 0 ? (
            <EmptyState title="No releases yet" body="Published albums from Studio will show here." />
          ) : null}
          {albums.map((album, index) => (
            <Link
              key={album.slug}
              href={`/music/${album.slug}`}
              className="group grid items-center gap-6 border border-steel bg-obsidian p-4 transition-colors hover:border-blood md:grid-cols-[140px_1fr_auto]"
            >
              <AlbumArt
                title={album.type}
                tone={album.tone}
                image={catalogImage(album.imagePath)}
                className="aspect-square"
              />
              <div>
                <p className="font-display text-[10px] tracking-[0.24em] text-blood uppercase">
                  {String(index + 1).padStart(2, "0")} · {album.type} · {album.year}
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-[0.06em] text-bone uppercase group-hover:text-blood">
                  {album.title}
                </h2>
                <p className="mt-2 text-sm text-ash">
                  {album.tracks.length}{" "}
                  {album.tracks.length === 1 ? "track" : "tracks"} · {album.duration} ·{" "}
                  {album.note}
                </p>
              </div>
              <span className="hidden font-display text-[11px] tracking-[0.2em] text-mist uppercase md:block">
                Open
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
