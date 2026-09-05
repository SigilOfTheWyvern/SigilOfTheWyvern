import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedNews, getSiteSettings } from "@/lib/catalog";
import { setting } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
  description: "Dispatches from SigilOfTheWyvern.",
};

export default async function NewsPage() {
  const [news, settings] = await Promise.all([getPublishedNews(), getSiteSettings()]);
  const intro = setting(settings, "news.intro");
  return (
    <main className="relative z-10 pt-24">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">
          {setting(settings, "news.kicker", "Dispatches")}
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-[0.08em] text-bone uppercase">
          News
        </h1>
        {intro ? <p className="mt-5 max-w-xl text-sm leading-7 text-ash">{intro}</p> : null}
        <ol className="mt-12">
          {news.map((item) => (
            <li key={item.slug} className="border-t border-steel py-10">
              <p className="text-xs tracking-[0.18em] text-ash uppercase">{item.date}</p>
              <h2 className="mt-3 font-display text-3xl tracking-[0.04em] text-bone uppercase">
                <Link href={`/news/${item.slug}`} className="hover:text-blood">
                  {item.title}
                </Link>
              </h2>
              <p className="mt-4 text-sm leading-7 text-mist">{item.excerpt}</p>
              <Link
                href={`/news/${item.slug}`}
                className="mt-6 inline-block font-display text-[11px] tracking-[0.2em] text-ash uppercase hover:text-blood"
              >
                Read →
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
