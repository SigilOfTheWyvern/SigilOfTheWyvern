"use client";

import { useState } from "react";
import { joinMailingList } from "@/actions/inbox";

export function MailingList() {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setStatus("idle");
    const result = await joinMailingList(formData);
    setPending(false);
    if (result?.error) {
      setStatus("error");
      setMessage(result.error);
      return;
    }
    setStatus("done");
    setMessage("The mark is set. You will hear when the next rite is called.");
  }

  return (
    <form action={onSubmit} className="mt-8">
      <label htmlFor="mailing-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="mailing-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Your email"
          className="h-12 shrink-0 border border-steel bg-void px-4 text-base text-bone outline-none placeholder:text-ash/70 focus:border-blood sm:flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 shrink-0 items-center justify-center border border-blood bg-blood px-6 font-display text-[11px] tracking-[0.22em] text-bone uppercase transition-colors hover:bg-ember disabled:opacity-60"
        >
          {pending ? "Saving" : "Enter the Mark"}
        </button>
      </div>
      {status === "error" ? (
        <p className="mt-3 text-sm text-ember" role="alert">
          {message}
        </p>
      ) : null}
      {status === "done" ? (
        <p className="mt-3 text-sm text-mist" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
