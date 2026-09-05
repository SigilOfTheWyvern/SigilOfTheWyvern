"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/fan";
  const [error, setError] = useState<string | null>(null);
  const connected = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 pt-24 pb-16">
      <div className="w-full max-w-md border border-steel bg-obsidian p-8">
        <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">Enter</p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.08em] text-bone uppercase">
          Login / Register
        </h1>
        <p className="mt-4 text-sm leading-7 text-ash">
          A mark is required to buy relics, tickets, and open the fan hall.
          Accounts are created in Supabase Authentication, not on this site.
        </p>
        {!connected ? (
          <p className="mt-4 text-sm text-ember">
            Supabase is not connected yet. Add the project URL and anon key to `.env`.
          </p>
        ) : null}
        <form
          className="mt-8 space-y-4"
          action={async (formData) => {
            const result = await loginAction(formData);
            if (result?.error) setError(result.error);
          }}
        >
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 h-12 w-full border border-steel bg-void px-4 text-sm text-bone outline-none focus:border-blood"
            />
          </label>
          <label className="block">
            <span className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">Password</span>
            <input
              name="password"
              type="password"
              required
              className="mt-2 h-12 w-full border border-steel bg-void px-4 text-sm text-bone outline-none focus:border-blood"
            />
          </label>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          <button
            type="submit"
            className="w-full border border-blood bg-blood px-6 py-3 font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:bg-ember"
          >
            Enter
          </button>
        </form>
        <p className="mt-6 text-sm text-ash">
          Need a mark first?{" "}
          <Link href="/register" className="text-blood hover:text-ember">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
