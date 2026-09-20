"use client";

import { ImageUpload } from "@/components/image-upload";
import { Field, inputClass } from "@/components/easy-fields";
import { btnClass, ghostBtn } from "@/components/dash-ui";
import { changePassword, updateProfile } from "@/actions/fan";

export function ProfileSettings({
  name,
  email,
  imagePath,
}: {
  name: string;
  email: string;
  imagePath?: string | null;
}) {
  return (
    <div className="max-w-md space-y-12">
      <form action={updateProfile} className="space-y-4">
        <ImageUpload name="imagePath" defaultValue={imagePath ?? ""} label="Mark / icon" compact />
        <Field label="Name">
          <input name="name" defaultValue={name} autoComplete="name" className={inputClass} required />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            defaultValue={email}
            autoComplete="email"
            className={inputClass}
            required
          />
        </Field>
        <button type="submit" className={btnClass}>
          Save profile
        </button>
      </form>
      <form action={changePassword} className="space-y-4">
        <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">Password</p>
        <input
          name="current"
          type="password"
          placeholder="Current"
          autoComplete="current-password"
          aria-label="Current password"
          className={inputClass}
        />
        <input
          name="next"
          type="password"
          placeholder="New"
          autoComplete="new-password"
          aria-label="New password"
          className={inputClass}
        />
        <button type="submit" className={ghostBtn}>
          Change password
        </button>
      </form>
    </div>
  );
}
