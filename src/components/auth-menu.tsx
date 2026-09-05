"use client";

import Link from "next/link";

export type AuthAccount = {
  id: string;
  roleSlug: string;
  studio: boolean;
  permissions: string[];
} | null;

const button =
  "border px-3 py-2 font-display text-[10px] tracking-[0.22em] uppercase";

export function AuthMenu({ account }: { account: AuthAccount }) {
  if (!account) {
    return (
      <div className="hidden items-center gap-2 lg:flex">
        <Link
          href="/login"
          className={`${button} border-steel text-mist hover:border-blood hover:text-bone`}
        >
          Login
        </Link>
        <Link
          href="/register"
          className={`${button} border-steel text-mist hover:border-blood hover:text-bone`}
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      {account.studio ? (
        <Link
          href="/studio"
          className={`${button} border-[#c4a574] bg-[#c4a574]/10 text-[#e8d7b0] hover:bg-[#c4a574]/20`}
        >
          Studio
        </Link>
      ) : null}
      <Link
        href="/fan"
        className={`${button} border-bone/40 bg-bone/5 text-bone hover:border-bone`}
      >
        Hall
      </Link>
    </div>
  );
}

export function AuthMenuMobile({ account }: { account: AuthAccount }) {
  if (!account) {
    return (
      <>
        <Link
          href="/login"
          className="mt-3 border border-steel px-4 py-3 text-center font-display text-[11px] tracking-[0.24em] text-bone uppercase"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="mt-3 border border-steel px-4 py-3 text-center font-display text-[11px] tracking-[0.24em] text-bone uppercase"
        >
          Register
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/fan"
        className="mt-3 border border-bone/40 px-4 py-3 text-center font-display text-[11px] tracking-[0.24em] text-bone uppercase"
      >
        Hall
      </Link>
      {account.studio ? (
        <Link
          href="/studio"
          className="mt-3 border border-[#c4a574] bg-[#c4a574]/10 px-4 py-3 text-center font-display text-[11px] tracking-[0.24em] text-[#e8d7b0] uppercase"
        >
          Studio
        </Link>
      ) : null}
    </>
  );
}
