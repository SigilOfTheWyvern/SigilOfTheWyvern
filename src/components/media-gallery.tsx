"use client";

import { useState } from "react";
import Image from "next/image";

export type GalleryPhoto = {
  id: string;
  caption: string;
  place: string;
  path: string | null;
};

export function MediaGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);
  const photo = active === null ? null : photos[active];

  if (photos.length === 0) {
    return <p className="text-sm text-ash">No stills published yet.</p>;
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className={`mb-4 w-full break-inside-avoid border border-steel bg-charcoal text-left transition-colors hover:border-blood ${
              index % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"
            }`}
          >
            <div className="relative h-full overflow-hidden">
              {item.path ? (
                <Image
                  src={item.path}
                  alt={item.caption}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-ash">No file</div>
              )}
              {item.place || item.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-void/70 px-3 py-2 text-xs text-mist">
                  {[item.place, item.caption].filter(Boolean).join(" — ")}
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {photo ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-void/85 p-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close photo"
            onClick={() => setActive(null)}
          />
          <figure className="relative w-full max-w-3xl border border-steel bg-obsidian p-6">
            <div className="relative aspect-video overflow-hidden bg-void">
              {photo.path ? (
                <Image src={photo.path} alt={photo.caption} fill className="object-contain" sizes="80vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ash">No file</div>
              )}
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-sm text-mist">
              <span>{[photo.place, photo.caption].filter(Boolean).join(" — ")}</span>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="font-display text-[10px] tracking-[0.2em] text-ash uppercase hover:text-blood"
              >
                Close
              </button>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
