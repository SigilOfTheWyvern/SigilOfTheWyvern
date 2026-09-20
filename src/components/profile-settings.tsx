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
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={updateProfile} className="dash-panel space-y-5 p-6 md:p-8">
        <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">Identity</p>
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
      <form action={changePassword} className="dash-panel h-fit space-y-5 p-6 md:p-8">
        <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">Password</p>
        <Field label="Current password">
          <input
            name="current"
            type="password"
            autoComplete="current-password"
            className={inputClass}
          />
        </Field>
        <Field label="New password">
          <input name="next" type="password" autoComplete="new-password" className={inputClass} />
        </Field>
        <p className="text-xs leading-6 text-ash">At least 8 characters.</p>
        <button type="submit" className={ghostBtn}>
          Change password
        </button>
      </form>
    </div>
  );
}
