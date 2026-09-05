import Link from "next/link";

export function DashHeader({
  kicker,
  title,
  hint,
  action,
}: {
  kicker: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-steel/80 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">{kicker}</p>
        <h1 className="mt-2 font-display text-4xl tracking-[0.06em] text-bone uppercase">{title}</h1>
        {hint ? <p className="mt-3 max-w-2xl text-sm leading-7 text-ash">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="border border-dashed border-steel bg-void/40 px-6 py-14 text-center">
      <p className="font-display text-xl uppercase text-bone">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ash">{body}</p>
      {href && label ? (
        <Link
          href={href}
          className="mt-6 inline-block border border-blood px-5 py-2 font-display text-[11px] tracking-[0.2em] text-bone uppercase hover:bg-blood"
        >
          {label}
        </Link>
      ) : null}
    </div>
  );
}

export const fieldClass =
  "h-11 w-full border border-steel bg-void px-3 text-sm text-bone outline-none focus:border-blood";
export const areaClass =
  "w-full border border-steel bg-void px-3 py-2 text-sm text-bone outline-none focus:border-blood";
export const btnClass =
  "border border-blood bg-blood px-4 py-2 font-display text-[11px] tracking-[0.18em] text-bone uppercase hover:bg-ember";
export const ghostBtn =
  "border border-steel px-4 py-2 font-display text-[11px] tracking-[0.18em] text-mist uppercase hover:border-blood hover:text-bone";
