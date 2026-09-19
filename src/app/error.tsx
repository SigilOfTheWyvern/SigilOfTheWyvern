"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 pt-24 pb-16">
      <div className="w-full max-w-md border border-steel bg-obsidian p-8 text-center">
        <p className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">Interrupted</p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.08em] text-bone uppercase">
          The rite failed
        </h1>
        <p className="mt-4 text-sm leading-7 text-ash">
          The hall could not open. Try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 w-full border border-blood bg-blood px-6 py-3 font-display text-[11px] tracking-[0.22em] text-bone uppercase hover:bg-ember"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
