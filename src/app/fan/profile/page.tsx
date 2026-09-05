import { changePassword, updateProfile } from "@/actions/fan";
import { DashFrame, fanLinks } from "@/components/dash-frame";
import { hasPermission, requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanProfilePage() {
  const user = await requireUser();
  const canEdit = hasPermission(user, "fan", "edit");

  return (
    <DashFrame eyebrow="Fan hall" title="Profile" roleColor={user.role.color} links={fanLinks}>
      <p className="text-sm text-ash">
        {user.email} · {user.role.name}
      </p>
      {canEdit ? (
        <>
          <form action={updateProfile} className="mt-8 max-w-md space-y-4">
            <label className="block">
              <span className="font-display text-[10px] tracking-[0.2em] text-ash uppercase">Name</span>
              <input
                name="name"
                defaultValue={user.name}
                className="mt-2 h-12 w-full border border-steel bg-void px-4 text-sm text-bone outline-none focus:border-blood"
              />
            </label>
            <button type="submit" className="border border-blood bg-blood px-5 py-3 font-display text-[11px] tracking-[0.2em] text-bone uppercase">
              Save
            </button>
          </form>
          <form action={changePassword} className="mt-12 max-w-md space-y-4">
            <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">Password</p>
            <input name="current" type="password" placeholder="Current" className="h-12 w-full border border-steel bg-void px-4 text-sm text-bone outline-none focus:border-blood" />
            <input name="next" type="password" placeholder="New" className="h-12 w-full border border-steel bg-void px-4 text-sm text-bone outline-none focus:border-blood" />
            <button type="submit" className="border border-steel px-5 py-3 font-display text-[11px] tracking-[0.2em] text-mist uppercase hover:border-blood">
              Change password
            </button>
          </form>
        </>
      ) : (
        <p className="mt-8 text-sm text-ash">Your role can view this hall but cannot change the profile.</p>
      )}
    </DashFrame>
  );
}
