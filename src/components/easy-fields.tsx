"use client";

import { useState } from "react";
import { centsToDollars, SITE_LINKS, slugify } from "@/lib/slug";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-display text-[10px] tracking-[0.18em] text-ash uppercase">{label}</span>
      {hint ? <p className="mt-1 text-xs text-ash">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const inputClass =
  "h-12 w-full border border-steel bg-void px-3 text-base text-bone outline-none focus:border-blood";
export const areaClass =
  "w-full border border-steel bg-void px-3 py-3 text-base text-bone outline-none focus:border-blood";

export function AutoSlug({
  titleName = "title",
  slugName = "slug",
  defaultTitle = "",
  defaultSlug = "",
  titleLabel = "Title",
}: {
  titleName?: string;
  slugName?: string;
  defaultTitle?: string;
  defaultSlug?: string;
  titleLabel?: string;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug || slugify(defaultTitle));
  const [locked, setLocked] = useState(Boolean(defaultSlug));

  return (
    <>
      <Field label={titleLabel}>
        <input
          name={titleName}
          value={title}
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!locked) setSlug(slugify(next));
          }}
          className={inputClass}
          required
        />
      </Field>
      <input type="hidden" name={slugName} value={slug} />
      <button
        type="button"
        className="inline-flex min-h-11 items-center text-left text-[10px] uppercase tracking-[0.16em] text-ash"
        onClick={() => setLocked(false)}
      >
        Link: /{slug || "…"}
      </button>
    </>
  );
}

export function DollarInput({
  defaultCents = 0,
  name = "priceDollars",
}: {
  defaultCents?: number;
  name?: string;
}) {
  return (
    <Field label="Price" hint="Enter dollars. For $38 write 38.">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ash">$</span>
        <input
          name={name}
          type="number"
          min="0"
          step="0.01"
          defaultValue={defaultCents ? centsToDollars(defaultCents) : ""}
          className={`${inputClass} pl-7`}
          required
        />
      </div>
    </Field>
  );
}

export function PublishSelect({ defaultValue = "published" }: { defaultValue?: string }) {
  return (
    <Field label="Visibility">
      <select name="status" defaultValue={defaultValue} className={inputClass}>
        <option value="published">Published — live on the site</option>
        <option value="draft">Draft — hidden</option>
      </select>
    </Field>
  );
}

export function SiteLinkSelect({
  name = "buttonHref",
  defaultValue = "",
  label = "Button goes to",
}: {
  name?: string;
  defaultValue?: string;
  label?: string;
}) {
  return (
    <Field label={label} hint="Pick a page on this site. Leave blank for no button.">
      <select name={name} defaultValue={defaultValue} className={inputClass}>
        <option value="">No button</option>
        {SITE_LINKS.map((link) => (
          <option key={link.href} value={link.href}>
            {link.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TourStatusSelect({ defaultValue = "on_sale" }: { defaultValue?: string }) {
  return (
    <Field label="Ticket status">
      <select name="status" defaultValue={defaultValue} className={inputClass}>
        <option value="on_sale">On sale</option>
        <option value="sold_out">Sold out</option>
        <option value="past">Past</option>
      </select>
    </Field>
  );
}
