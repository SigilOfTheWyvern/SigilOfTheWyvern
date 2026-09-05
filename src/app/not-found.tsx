import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-[11px] tracking-[0.36em] text-blood uppercase">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-[0.12em] text-bone uppercase">
        The mark is lost
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-ash">
        This path does not exist. Return to the seal.
      </p>
      <Link
        href="/"
        className="mt-8 border border-blood px-6 py-3 font-display text-[11px] tracking-[0.24em] text-bone uppercase hover:bg-blood"
      >
        Return Home
      </Link>
    </main>
  );
}
