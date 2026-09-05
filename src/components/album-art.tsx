import Image from "next/image";
import { catalogImage } from "@/lib/slug";

export function AlbumArt({
  title,
  tone,
  image,
  className = "",
}: {
  title: string;
  tone: string;
  image?: string | null;
  className?: string;
}) {
  const src = catalogImage(image);
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-charcoal ${className}`}>
        <Image src={src} alt={title} fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${tone} ${className}`}
    >
      <div className="absolute inset-5 border border-blood/20" />
      <span className="relative px-4 text-center font-display text-sm tracking-[0.18em] text-mist uppercase">
        {title}
      </span>
    </div>
  );
}
