"use client";

import Link from "next/link";
import { useState } from "react";
import { loginAction } from "@/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 pt-24 pb-16">
      <div className="w-full max-w-md border border-steel bg-obsidian p-8">
        <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">Register</p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.08em] text-bone uppercase">
          Enter
        </h1>
        <p className="mt-4 text-sm leading-7 text-ash">
          This form signs in an existing mark. New accounts are created in Supabase Authentication, not here.
        </p>
        <form
          className="mt-8 space-y-4"
          action={async (formData) => {
            const result = await loginAction(formData);
            if (result?.error) setError(result.error);
          }}
        >
          <input type="hidden" name="next" value="/fan" />
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
          Already marked?{" "}
          <Link href="/login" className="text-blood hover:text-ember">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
