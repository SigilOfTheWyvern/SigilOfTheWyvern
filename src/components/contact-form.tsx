"use client";

import { useState } from "react";
import { submitContact } from "@/actions/inbox";

const subjects = ["Booking", "Press", "Store", "Other"] as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setStatus("idle");
    const result = await submitContact(formData);
    setPending(false);
    if (result?.error) {
      setStatus("error");
      setMessage(result.error);
      return;
    }
    setStatus("done");
    setMessage("Received. If the mark answers, it will be by email.");
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <Field label="Name" name="name" type="text" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <label className="block">
        <span className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">
          Subject
        </span>
        <select
          name="subject"
          className="mt-2 h-12 w-full border border-steel bg-void px-4 text-base text-bone outline-none focus:border-blood"
          defaultValue="Booking"
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">
          Message
        </span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={8}
          className="mt-2 w-full border border-steel bg-void px-4 py-3 text-base text-bone outline-none focus:border-blood"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center border border-blood bg-blood px-8 py-3 font-display text-[11px] tracking-[0.24em] text-bone uppercase hover:bg-ember disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending" : "Send"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-ember" role="alert">
          {message}
        </p>
      ) : null}
      {status === "done" ? (
        <p className="text-sm text-mist" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="font-display text-[10px] tracking-[0.24em] text-ash uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="mt-2 h-12 w-full border border-steel bg-void px-4 text-base text-bone outline-none focus:border-blood"
      />
    </label>
  );
}
