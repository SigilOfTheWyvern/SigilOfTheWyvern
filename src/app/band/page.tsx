import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState } from "@/components/dash-ui";
import { getPublishedMembers, getSiteSettings } from "@/lib/catalog";
import { setting } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Band",
  description: "The four voices of SigilOfTheWyvern.",
};

export default async function BandPage() {
  const [members, settings] = await Promise.all([getPublishedMembers(), getSiteSettings()]);
  const headline = setting(settings, "band.headline", "Band");
  const [headlineTop, headlineBottom] = headline.split("\n");
  const lead = setting(settings, "band.lead");
  const body = setting(settings, "band.body");
  const kicker = setting(settings, "band.kicker", "The mark");

  return (
    <main className="relative z-10 pt-24">
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">
          {kicker}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-[0.04em] text-bone uppercase sm:text-5xl md:text-6xl">
          {headlineTop}
          {headlineBottom ? (
            <>
              <br />
              {headlineBottom}
            </>
          ) : null}
        </h1>
        {lead ? <p className="mt-10 text-xl leading-9 text-mist">{lead}</p> : null}
        {body ? <p className="mt-6 text-base leading-8 text-ash">{body}</p> : null}
      </article>

      <section className="border-y border-steel bg-obsidian">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          {members.length === 0 ? (
            <div className="px-5 py-16 md:col-span-2 md:px-8">
              <EmptyState title="No members published" body="Band members added in Studio will show here." />
            </div>
          ) : null}
          {members.map((member, index) => (
            <article
              key={member.name}
              className={`flex gap-6 px-5 py-10 md:px-10 ${
                index % 2 === 0 ? "md:border-r md:border-steel" : ""
              } ${index < 2 ? "border-b border-steel" : ""}`}
            >
              {member.imagePath ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-blood">
                  <Image src={member.imagePath} alt={member.name} fill className="object-cover" sizes="80px" />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-blood font-display text-3xl text-blood">
                  {member.mark}
                </div>
              )}
              <div>
                <p className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">
                  {member.role}
                </p>
                <h2 className="mt-2 font-display text-2xl tracking-[0.06em] text-bone uppercase">
                  {member.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-mist">{member.line}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
