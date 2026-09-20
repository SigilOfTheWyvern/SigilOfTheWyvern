import { ProfileSettings } from "@/components/profile-settings";
import { DashHeader } from "@/components/dash-ui";
import { requireStudio } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function StudioProfilePage() {
  const user = await requireStudio();

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Account"
        title="Profile"
        hint="Name, email, password, and the mark shown in both halls."
      />
      <div className="mt-8">
        <ProfileSettings name={user.name} email={user.email} imagePath={user.imagePath} />
      </div>
    </main>
  );
}
