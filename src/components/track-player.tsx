"use client";

import { useEffect, useState } from "react";

type Track = { title: string; duration: string };

export function TrackPlayer({
  album,
  tracks,
}: {
  album: string;
  tracks: readonly Track[];
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = tracks[index];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 0.4));
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing, index]);

  function select(next: number) {
    setIndex(next);
    setProgress(0);
    setPlaying(true);
  }

  return (
    <div className="border border-steel bg-charcoal/70">
      <div className="flex items-center justify-between gap-4 border-b border-steel px-5 py-4">
        <div>
          <p className="font-display text-[10px] tracking-[0.24em] text-blood uppercase">
            Now playing
          </p>
          <p className="mt-1 font-display text-sm tracking-[0.1em] text-bone uppercase">
            {track.title}
          </p>
          <p className="mt-1 text-xs text-ash">{album}</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="flex h-12 w-12 items-center justify-center border border-blood text-blood hover:bg-blood hover:text-bone"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
      <div className="px-5 py-4">
        <div className="h-px bg-steel">
          <div className="h-px bg-blood" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-[11px] tracking-[0.16em] text-ash uppercase">
          {track.duration}
        </p>
      </div>
      <ol>
        {tracks.map((item, itemIndex) => (
          <li key={item.title} className="border-t border-steel">
            <button
              type="button"
              onClick={() => select(itemIndex)}
              className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-colors hover:bg-void ${
                itemIndex === index ? "text-bone" : "text-ash"
              }`}
            >
              <span>
                <span className="mr-4 font-display text-[10px] tracking-[0.16em] text-blood">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                {item.title}
              </span>
              <span className="text-xs text-ash">{item.duration}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
