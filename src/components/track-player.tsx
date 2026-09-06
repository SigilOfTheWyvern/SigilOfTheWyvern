type Track = { title: string; duration: string };

export function TrackPlayer({
  album,
  tracks,
}: {
  album: string;
  tracks: readonly Track[];
}) {
  if (tracks.length === 0) {
    return <p className="text-sm text-ash">No tracks listed for this release.</p>;
  }

  return (
    <div className="border border-steel bg-charcoal/70">
      <div className="border-b border-steel px-5 py-4">
        <p className="font-display text-[10px] tracking-[0.24em] text-blood uppercase">
          Track list
        </p>
        <p className="mt-1 font-display text-sm tracking-[0.1em] text-bone uppercase">
          {album}
        </p>
      </div>
      <ol>
        {tracks.map((item, itemIndex) => (
          <li key={`${item.title}-${itemIndex}`} className="border-t border-steel">
            <div className="flex min-h-12 w-full items-center justify-between px-5 py-3 text-sm">
              <span className="text-bone">
                <span className="mr-4 font-display text-[10px] tracking-[0.16em] text-blood">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                {item.title}
              </span>
              <span className="text-xs text-ash">{item.duration}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
