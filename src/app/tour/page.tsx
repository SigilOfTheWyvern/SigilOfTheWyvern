import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEvents, getSiteSettings } from "@/lib/catalog";
import { EmptyState } from "@/components/dash-ui";
import { formatShowDate } from "@/lib/dates";
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
      <header className="relative overflow-hidden border-b border-blood/40 bg-void px-5 py-14 sm:py-20 md:px-8 md:py-28">
        <p className="font-display text-[11px] tracking-[0.4em] text-blood uppercase">
          {setting(settings, "tour.kicker", "On tour")}
        </p>
        <h1 className="mt-4 max-w-5xl break-words font-display text-[clamp(2rem,11vw,2.75rem)] leading-[0.95] tracking-[0.06em] whitespace-pre-line text-bone uppercase sm:text-5xl md:text-8xl">
          {setting(settings, "tour.headline", "Tour").replace(" ", "\n")}
        </h1>
      </header>
      <ol className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        {upcoming.length === 0 ? (
          <li className="py-4">
            <EmptyState title="No upcoming dates" body="When a date is published in Studio, it will appear here." />
          </li>
        ) : null}
        {upcoming.map((show) => (
          <li key={show.id} className="grid gap-3 border-b border-steel py-8 md:grid-cols-[8rem_1fr_auto] md:items-end">
            <p className="font-display text-sm tracking-[0.14em] text-blood uppercase">
              {formatShowDate(show.date)}
            </p>
            <div>
              <p className="break-words font-display text-2xl tracking-[0.04em] text-bone uppercase sm:text-4xl md:text-5xl">{show.city}</p>
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
                className="inline-flex min-h-11 w-fit items-center border border-blood px-5 py-2 font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:bg-blood"
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
          {past.length === 0 ? (
            <p className="mt-6 text-sm text-ash">No past dates yet.</p>
          ) : (
          <ul className="mt-6 space-y-4">
            {past.map((show) => (
              <li key={show.id} className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-ash">{formatShowDate(show.date)}</span>
                <span className="text-bone">{show.city} · {show.venue}</span>
              </li>
            ))}
          </ul>
          )}
        </div>
      </section>
    </main>
  );
}
