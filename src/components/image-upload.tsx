"use client";

import { useState } from "react";

export function ImageUpload({
  name,
  defaultValue = "",
  label = "Photo",
  compact = false,
}: {
  name: string;
  defaultValue?: string;
  label?: string;
  compact?: boolean;
}) {
  const [path, setPath] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });
    const data = (await response.json()) as { path?: string; error?: string };
    setBusy(false);
    if (!response.ok || !data.path) {
      setError(data.error ?? "Upload failed.");
      return;
    }
    setPath(data.path);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void upload(file);
    event.target.value = "";
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={path} />
      <p className="font-display text-[10px] tracking-[0.2em] text-ash uppercase">{label}</p>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="border border-dashed border-steel bg-void/40"
      >
        {path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={path}
            alt=""
            className={compact ? "mx-auto h-32 w-32 object-cover" : "h-40 w-full object-cover"}
          />
        ) : (
          <div
            className={`flex items-center justify-center px-4 text-center text-xs text-ash ${compact ? "h-32" : "h-40"}`}
          >
            {busy ? "Uploading…" : "Drop a photo here, or choose one. No name or link needed."}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex min-h-11 cursor-pointer items-center border border-steel px-3 py-2 font-display text-[10px] tracking-[0.18em] text-mist uppercase hover:border-blood hover:text-bone">
          {busy ? "Uploading…" : path ? "Replace photo" : "Upload photo"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={onChange}
            disabled={busy}
          />
        </label>
        {path ? (
          <button
            type="button"
            onClick={() => {
              setPath("");
              setError(null);
            }}
            className="inline-flex min-h-11 items-center border border-steel px-3 py-2 font-display text-[10px] tracking-[0.18em] text-ember uppercase hover:border-ember"
          >
            Remove photo
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-ember">{error}</p> : null}
    </div>
  );
}
