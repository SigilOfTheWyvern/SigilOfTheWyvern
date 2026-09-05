import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEvents, getSiteSettings } from "@/lib/catalog";
import { setting } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tour",
  description: "SigilOfTheWyvern tour dates — Thorn Crown MMXXVI.",
};

export default async function TourPage() {
  const [events, settings] = await Promise.all([getPublishedEvents(), getSiteSettings()]);
  const upcoming = events.filter((event) => event.status !== "past");
  const past = events.filter((event) => event.status === "past");

  return (
    <main className="relative z-10 pt-24">
      <header className="relative overflow-hidden border-b border-blood/40 bg-void px-5 py-20 md:px-8 md:py-28">
        <p className="font-display text-[11px] tracking-[0.4em] text-blood uppercase">
          {setting(settings, "tour.kicker", "On tour")}
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-6xl leading-[0.9] tracking-[0.06em] text-bone uppercase md:text-8xl">
          {setting(settings, "tour.headline", "Tour").replace(" ", "\n")}
        </h1>
      </header>
      <ol className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        {upcoming.map((show) => (
          <li key={show.id} className="grid gap-3 border-b border-steel py-8 md:grid-cols-[8rem_1fr_auto] md:items-end">
            <p className="font-display text-sm tracking-[0.14em] text-blood uppercase">
              {show.date.toUTCString().slice(0, 16)}
            </p>
            <div>
              <p className="font-display text-4xl tracking-[0.04em] text-bone uppercase md:text-5xl">{show.city}</p>
              <p className="mt-2 text-sm text-ash">
                {show.venue}
                {show.support ? ` · w/ ${show.support}` : ""}
              </p>
            </div>
            {show.status === "sold_out" ? (
              <span className="font-display text-[11px] tracking-[0.22em] text-ash uppercase">Sold Out</span>
            ) : (
              <Link
                href={`/tour/${show.id}`}
                className="w-fit border border-blood px-5 py-2 font-display text-[10px] tracking-[0.22em] text-bone uppercase hover:bg-blood"
              >
                Tickets
              </Link>
            )}
          </li>
        ))}
      </ol>
      <section className="border-t border-steel bg-obsidian">
        <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
          <p className="font-display text-[11px] tracking-[0.28em] text-mist uppercase">
            {setting(settings, "tour.past", "Past rites")}
          </p>
          <ul className="mt-6 space-y-4">
            {past.map((show) => (
              <li key={show.id} className="flex justify-between gap-4 text-sm">
                <span className="text-ash">{show.date.toUTCString().slice(0, 16)}</span>
                <span className="text-bone">{show.city} · {show.venue}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
