import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { MailingList } from "@/components/mailing-list";
import { getSiteSettings } from "@/lib/catalog";
import { setting } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Booking, press, and the SigilOfTheWyvern mailing list.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const origin = setting(settings, "contact.origin");
  const intro = setting(settings, "contact.intro");
  const booking = setting(settings, "contact.booking");
  const press = setting(settings, "contact.press");
  const pressKit = setting(settings, "contact.pressKit");
  const mailingIntro = setting(settings, "contact.mailingIntro", "First word on offerings and dates.");
  return (
    <main className="relative z-10 pt-24">
      <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <section className="border-b border-steel px-5 py-14 md:border-r md:border-b-0 md:px-8 md:py-20">
          <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">
            {setting(settings, "contact.kicker", "Direct line")}
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-[0.08em] text-bone uppercase">
            Contact
          </h1>
          {intro ? <p className="mt-5 max-w-md text-sm leading-7 text-ash">{intro}</p> : null}
          <div className="mt-10">
            <ContactForm />
          </div>
        </section>

        <aside className="bg-obsidian px-5 py-14 md:px-8 md:py-20">
          {booking || press || origin ? (
            <div className="border border-steel p-6">
              <p className="font-display text-[11px] tracking-[0.24em] text-blood uppercase">
                Channels
              </p>
              <dl className="mt-6 space-y-5 text-sm">
                {booking ? (
                  <div>
                    <dt className="tracking-[0.16em] text-ash uppercase">Booking</dt>
                    <dd className="mt-1 text-bone">{booking}</dd>
                  </div>
                ) : null}
                {press ? (
                  <div>
                    <dt className="tracking-[0.16em] text-ash uppercase">Press</dt>
                    <dd className="mt-1 text-bone">{press}</dd>
                  </div>
                ) : null}
                {origin ? (
                  <div>
                    <dt className="tracking-[0.16em] text-ash uppercase">Origin</dt>
                    <dd className="mt-1 text-mist">{origin}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {pressKit ? (
            <div className="mt-8 border border-steel p-6">
              <p className="font-display text-[11px] tracking-[0.24em] text-mist uppercase">
                Press kit
              </p>
              <p className="mt-4 text-sm leading-7 text-ash whitespace-pre-wrap">{pressKit}</p>
            </div>
          ) : null}

          <div className={booking || press || origin || pressKit ? "mt-8" : ""}>
            <p className="font-display text-[11px] tracking-[0.24em] text-mist uppercase">
              Mailing list
            </p>
            <p className="mt-3 text-sm leading-7 text-ash">
              {mailingIntro}
            </p>
            <MailingList />
          </div>
        </aside>
      </div>
    </main>
  );
}
