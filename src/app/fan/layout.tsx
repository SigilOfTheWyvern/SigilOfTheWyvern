import { fanGroups } from "@/components/dash-frame";
import { StudioNav } from "@/components/studio-nav";
import { canAccessFan, canAccessStudio, requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePermission("fan", "view");

  return (
    <div className="studio-shell">
      <StudioNav
        eyebrow="Fan hall"
        brand="Fan"
        name={user.name}
        roleName={user.role.name}
        roleColor={user.role.color}
        imagePath={user.imagePath}
        showHall={canAccessStudio(user)}
        showFan={canAccessFan(user)}
        groups={fanGroups}
      />
      <div id="main-content" className="studio-main" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
