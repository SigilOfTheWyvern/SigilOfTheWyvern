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
    <div className="pb-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[10px] tracking-[0.34em] text-blood uppercase">{kicker}</p>
          <h1 className="mt-3 font-display text-3xl tracking-[0.07em] text-bone uppercase sm:text-4xl">
            {title}
          </h1>
          {hint ? <p className="mt-3 max-w-2xl text-sm leading-7 text-ash">{hint}</p> : null}
        </div>
        {action}
      </div>
      <div className="dash-rule mt-7" />
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
    <div className="dash-panel px-6 py-16 text-center">
      <p className="font-display text-xl tracking-[0.06em] uppercase text-bone">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ash">{body}</p>
      {href && label ? (
        <Link
          href={href}
          className="mt-7 inline-flex min-h-12 items-center justify-center border border-blood px-6 py-2 font-display text-[11px] tracking-[0.22em] text-bone uppercase transition-colors hover:bg-blood"
        >
          {label}
        </Link>
      ) : null}
    </div>
  );
}

export const fieldClass =
  "h-12 w-full border border-steel bg-void/80 px-3 text-base text-bone outline-none transition-colors focus:border-blood";
export const areaClass =
  "w-full border border-steel bg-void/80 px-3 py-3 text-base text-bone outline-none transition-colors focus:border-blood";
export const btnClass =
  "inline-flex min-h-11 items-center justify-center border border-blood bg-blood px-5 py-2 font-display text-[11px] tracking-[0.2em] text-bone uppercase transition-colors hover:bg-ember";
export const ghostBtn =
  "inline-flex min-h-11 items-center justify-center border border-steel px-5 py-2 font-display text-[11px] tracking-[0.2em] text-mist uppercase transition-colors hover:border-blood hover:text-bone";
