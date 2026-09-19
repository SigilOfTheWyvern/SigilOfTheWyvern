import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedNewsItem } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedNewsItem(slug);
  if (!item) return { title: "News" };
  return { title: item.title, description: item.excerpt };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublishedNewsItem(slug);
  if (!item) notFound();

  return (
    <main className="relative z-10 pt-24">
      <article className="mx-auto max-w-2xl px-5 py-16 md:px-8">
        <Link
          href="/news"
          className="inline-flex min-h-11 items-center font-display text-[10px] tracking-[0.24em] text-mist uppercase hover:text-blood"
        >
          ← All news
        </Link>
        <p className="mt-8 text-xs tracking-[0.18em] text-ash uppercase">{item.date}</p>
        <h1 className="mt-4 font-display text-3xl leading-tight tracking-[0.04em] text-bone uppercase sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-8 text-lg leading-9 text-mist">{item.excerpt}</p>
        <p className="mt-6 text-base leading-8 text-ash">{item.body}</p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/tour"
            className="inline-flex min-h-12 flex-1 items-center justify-center border border-blood px-5 py-3 font-display text-[11px] tracking-[0.2em] text-bone uppercase hover:bg-blood sm:flex-none"
          >
            Tour
          </Link>
          <Link
            href="/music"
            className="inline-flex min-h-12 flex-1 items-center justify-center border border-steel px-5 py-3 font-display text-[11px] tracking-[0.2em] text-mist uppercase hover:border-blood hover:text-bone sm:flex-none"
          >
            Music
          </Link>
        </div>
      </article>
    </main>
  );
}
