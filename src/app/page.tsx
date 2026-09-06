import Image from "next/image";
import Link from "next/link";
import { getPublishedAlbums, getPublishedEvents, getPublishedNews, getPublishedPage, getSiteSettings } from "@/lib/catalog";
import { formatShowDate } from "@/lib/dates";
import { setting, settingLines } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [albums, events, news, settings, homePage] = await Promise.all([
    getPublishedAlbums(),
    getPublishedEvents(),
    getPublishedNews(),
    getSiteSettings(),
    getPublishedPage("home"),
  ]);
  const latest = albums[0];
  const nextShow = events.find((event) => event.status === "on_sale");
  const tagline = setting(settings, "home.tagline");
  const year = setting(settings, "home.year");
  const genre = setting(settings, "home.genre");
  const logo = setting(settings, "home.logo", "/logo.png");
  const siteName = setting(settings, "site.name", "SigilOfTheWyvern");
  const listenLabel = setting(settings, "home.listenLabel", "Listen");
  const tourLabel = setting(settings, "home.tourLabel", "Tour Dates");
  const latestKicker = setting(settings, "home.latestKicker", "Latest offering");
  const nextKicker = setting(settings, "home.nextKicker", "Next rite");
  const newsKicker = setting(settings, "home.newsKicker", "Dispatches");
  const allNews = setting(settings, "home.allNews", "All news");
  const cards = [
    { href: "/music", title: "Music", copy: settings["home.musicCopy"]?.trim() ?? "" },
    { href: "/media", title: "Media", copy: settings["home.mediaCopy"]?.trim() ?? "" },
    { href: "/store", title: "Store", copy: settings["home.storeCopy"]?.trim() ?? "" },
  ];
  const sponsors = settingLines(settings, "home.sponsors");
  const testimonials = settingLines(settings, "home.testimonials");

  return (
    <main className="relative z-10">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,38,0.18),transparent_58%)]"
        />
        {year || genre ? (
          <p className="relative font-display text-[11px] tracking-[0.42em] text-ash uppercase">
            {[year, genre].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        <div className="logo-glow relative mt-8 w-[min(88vw,520px)]">
          <Image
            src={logo}
            alt={`${siteName} logo`}
            width={1100}
            height={900}
            priority
            className="h-auto w-full"
          />
        </div>
        <h1 className="relative mt-8 text-center font-display text-3xl font-semibold tracking-[0.18em] text-bone uppercase sm:text-5xl md:text-6xl">
          {siteName}
        </h1>
        {tagline ? (
          <p className="relative mt-5 max-w-xl text-center text-base leading-relaxed text-ash sm:text-lg">
            {tagline}
          </p>
        ) : null}
        <div className="relative mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href="/music"
            className="inline-flex min-h-12 items-center justify-center border border-blood bg-blood px-8 py-3 text-center font-display text-[11px] tracking-[0.24em] text-bone uppercase hover:bg-ember"
          >
            {listenLabel}
          </Link>
          <Link
            href="/tour"
            className="inline-flex min-h-12 items-center justify-center border border-mist/40 px-8 py-3 text-center font-display text-[11px] tracking-[0.24em] text-bone uppercase hover:border-blood hover:text-blood"
          >
            {tourLabel}
          </Link>
        </div>
      </section>

      {latest || nextShow ? (
        <section className="border-y border-steel bg-obsidian">
          <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
            {latest ? (
              <Link
                href={`/music/${latest.slug}`}
                className="group border-b border-steel px-5 py-10 md:border-r md:border-b-0 md:px-8 md:py-14"
              >
                <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">
                  {latestKicker}
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-[0.08em] text-bone uppercase group-hover:text-blood">
                  {latest.title}
                </h2>
                <p className="mt-3 text-sm text-ash">
                  {[latest.type, latest.year, latest.duration].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-6 font-display text-[11px] tracking-[0.2em] text-mist uppercase">
                  Open the single →
                </p>
              </Link>
            ) : (
              <div className="px-5 py-10" />
            )}
            {nextShow ? (
              <Link href="/tour" className="group px-5 py-10 md:px-8 md:py-14">
                <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">
                  {nextKicker}
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-[0.08em] text-bone uppercase group-hover:text-blood">
                  {nextShow.city}
                </h2>
                <p className="mt-3 text-sm text-ash">
                  {formatShowDate(nextShow.date)} · {nextShow.venue}
                </p>
                <p className="mt-6 font-display text-[11px] tracking-[0.2em] text-mist uppercase">
                  See all dates →
                </p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="border border-steel px-6 py-8 transition-colors hover:border-blood"
            >
              <h3 className="font-display text-2xl tracking-[0.1em] text-bone uppercase">
                {card.title}
              </h3>
              {card.copy ? <p className="mt-3 text-sm text-ash">{card.copy}</p> : null}
            </Link>
          ))}
        </div>
      </section>

      {news[0] ? (
        <section className="border-t border-steel bg-obsidian">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8">
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">
                {newsKicker}
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-[0.08em] text-bone uppercase">
                {news[0].title}
              </h2>
              {news[0].excerpt ? (
                <p className="mt-4 max-w-xl text-sm leading-7 text-ash">{news[0].excerpt}</p>
              ) : null}
            </div>
            <Link
              href="/news"
              className="inline-flex min-h-12 items-center justify-center border border-mist/40 px-6 py-3 font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:border-blood hover:text-blood"
            >
              {allNews}
            </Link>
          </div>
        </section>
      ) : null}

      {sponsors.length ? (
        <section className="border-t border-steel">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">Sponsors</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {sponsors.map((name) => (
                <li
                  key={name}
                  className="border border-steel px-4 py-3 font-display text-[11px] tracking-[0.18em] text-mist uppercase"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="border-t border-steel bg-obsidian">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">Voices</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {testimonials.map((quote) => (
                <li key={quote} className="border border-steel px-5 py-6 text-sm leading-7 text-ash">
                  {quote}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {homePage?.sections?.map((section) => (
        <section key={section.id} className="border-t border-steel">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:px-8">
            {section.imagePath ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-steel">
                <Image
                  src={section.imagePath}
                  alt={section.heading ?? ""}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            ) : null}
            <div className={section.imagePath ? "" : "md:col-span-2"}>
              {section.heading ? (
                <h2 className="font-display text-3xl tracking-[0.08em] text-bone uppercase">
                  {section.heading}
                </h2>
              ) : null}
              {section.body ? <p className="mt-4 max-w-xl text-sm leading-7 text-ash">{section.body}</p> : null}
              {section.buttonHref && section.buttonLabel ? (
                <Link
                  href={section.buttonHref}
                  className="mt-6 inline-block border border-blood px-6 py-3 font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:bg-blood"
                >
                  {section.buttonLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
