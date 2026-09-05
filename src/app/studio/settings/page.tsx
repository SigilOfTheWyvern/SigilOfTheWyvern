import { saveSettingGroup } from "@/actions/cms";
import { DashHeader } from "@/components/dash-ui";
import { Field, areaClass, inputClass } from "@/components/easy-fields";
import { ImageUpload } from "@/components/image-upload";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";
import { SITE_SECTIONS, fieldByKey, isLongSetting, setting } from "@/lib/site-copy";

export default async function StudioSettingsPage() {
  const user = await requirePermission("settings", "view");
  const settings = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(settings.map((row) => [row.key, row.value]));
  const canEdit = hasPermission(user, "settings", "edit");
  const logo = values["home.logo"]?.trim() || "/logo.png";
  const siteName = setting(values, "site.name", "SigilOfTheWyvern");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Site"
        title="Settings"
        hint="This is the same text and logo the public site uses. Change it here and the main page updates."
      />

      <section className="mt-8 border border-steel bg-obsidian p-6">
        <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">Live homepage preview</p>
        <div className="mt-4 flex flex-col items-center border border-steel bg-void px-6 py-10">
          {(values["home.year"] || values["home.genre"]) ? (
            <p className="font-display text-[10px] tracking-[0.28em] text-ash uppercase">
              {[values["home.year"], values["home.genre"]].filter(Boolean).join(" · ")}
            </p>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" className="mt-4 w-40" />
          <p className="mt-4 font-display text-2xl tracking-[0.16em] text-bone uppercase">{siteName}</p>
          {values["home.tagline"] ? (
            <p className="mt-3 max-w-md text-center text-sm text-ash">{values["home.tagline"]}</p>
          ) : null}
        </div>
      </section>

      {SITE_SECTIONS.map((section) => (
        <form
          key={section.id}
          action={saveSettingGroup}
          className="mt-8 border border-steel bg-obsidian p-6"
        >
          <p className="font-display text-[11px] tracking-[0.18em] text-bone uppercase">{section.label}</p>
          <p className="mt-1 text-xs text-ash">{section.hint}</p>
          {section.id === "home" ? (
            <div className="mt-6 max-w-md">
              <ImageUpload name="home.logo" defaultValue={values["home.logo"] ?? ""} label="Homepage logo" />
            </div>
          ) : null}
          <div className="mt-6 grid gap-4">
            {section.keys.map((key) => {
              const field = fieldByKey(key);
              if (!field) return null;
              return (
                <Field key={key} label={field.label} hint={field.hint}>
                  {isLongSetting(key) ? (
                    <textarea
                      name={key}
                      defaultValue={values[key] ?? ""}
                      disabled={!canEdit}
                      className={areaClass}
                    />
                  ) : (
                    <input
                      name={key}
                      defaultValue={values[key] ?? ""}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                  )}
                </Field>
              );
            })}
          </div>
          {canEdit ? (
            <button className="mt-6 border border-blood bg-blood px-4 py-2 text-xs uppercase">
              Save {section.label.toLowerCase()}
            </button>
          ) : null}
        </form>
      ))}
    </main>
  );
}
