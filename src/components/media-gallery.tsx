"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (active === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

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
            className={`mb-4 w-full break-inside-avoid border border-steel bg-charcoal text-left transition-colors hover:border-blood focus-visible:border-blood ${
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-void/90 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close photo"
            onClick={() => setActive(null)}
          />
          <figure className="relative max-h-full w-full max-w-3xl overflow-y-auto border border-steel bg-obsidian p-4 sm:p-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-void sm:aspect-video">
              {photo.path ? (
                <Image src={photo.path} alt={photo.caption} fill className="object-contain" sizes="90vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ash">No file</div>
              )}
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-mist">
              <span className="min-w-0">{[photo.place, photo.caption].filter(Boolean).join(" — ")}</span>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="inline-flex min-h-11 items-center border border-steel px-4 font-display text-[10px] tracking-[0.2em] text-ash uppercase hover:border-blood hover:text-blood"
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
