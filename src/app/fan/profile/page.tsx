import { ProfileSettings } from "@/components/profile-settings";
import { DashFrame } from "@/components/dash-frame";
import { hasPermission, requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanProfilePage() {
  const user = await requireUser();
  const canEdit = hasPermission(user, "fan", "edit") || hasPermission(user, "studio", "view");

  return (
    <DashFrame
      kicker="Account"
      title="Profile"
      hint="Name, email, password, and the mark shown in both halls."
    >
      {canEdit ? (
        <ProfileSettings name={user.name} email={user.email} imagePath={user.imagePath} />
      ) : (
        <p className="text-sm text-ash">Your role can view this hall but cannot change the profile.</p>
      )}
    </DashFrame>
  );
}
