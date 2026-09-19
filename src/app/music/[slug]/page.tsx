import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumArt } from "@/components/album-art";
import { TrackPlayer } from "@/components/track-player";
import { getPublishedAlbum } from "@/lib/catalog";
import { catalogImage } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getPublishedAlbum(slug);
  if (!album) return { title: "Music" };
  return { title: album.title, description: album.summary };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await getPublishedAlbum(slug);
  if (!album) notFound();

  return (
    <main className="relative z-10 pt-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-12 md:px-8 md:py-20">
        <div>
          <AlbumArt title={album.year} tone={album.tone} image={catalogImage(album.imagePath)} className="aspect-square" />
          <p className="mt-6 text-sm text-ash">
            {album.label} · {album.duration}
          </p>
        </div>
        <div>
          <Link
            href="/music"
            className="inline-flex min-h-11 items-center font-display text-[10px] tracking-[0.24em] text-mist uppercase hover:text-blood"
          >
            ← All music
          </Link>
          <p className="mt-6 font-display text-[11px] tracking-[0.28em] text-blood uppercase">
            {album.type}
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-[0.06em] text-bone uppercase sm:text-4xl md:text-5xl">
            {album.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-mist">{album.summary}</p>
          <div className="mt-10">
            <TrackPlayer album={album.title} tracks={album.tracks} />
          </div>
        </div>
      </div>

      <section className="border-t border-steel bg-obsidian">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div>
            <p className="font-display text-[11px] tracking-[0.28em] text-blood uppercase">
              Fragment
            </p>
            <pre className="mt-6 font-display text-base leading-8 text-bone whitespace-pre-wrap sm:text-lg sm:leading-9">
              {album.lyrics}
            </pre>
          </div>
          <div className="border border-steel p-6">
            <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
              Credits
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              {album.recorded ? (
                <div className="flex justify-between gap-4 border-b border-steel pb-3">
                  <dt className="text-ash">Recorded</dt>
                  <dd className="text-bone">{album.recorded}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-b border-steel pb-3">
                <dt className="text-ash">Year</dt>
                <dd className="text-bone">{album.year}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ash">Label</dt>
                <dd className="text-bone">{album.label}</dd>
              </div>
            </dl>
            <Link
              href="/store"
              className="mt-8 inline-flex min-h-12 items-center border border-blood px-5 py-3 font-display text-[11px] tracking-[0.2em] text-bone uppercase hover:bg-blood"
            >
              Buy relics
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
