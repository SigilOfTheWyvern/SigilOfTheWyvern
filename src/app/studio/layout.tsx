import { StudioNav } from "@/components/studio-nav";
import { ensureSystemRoles } from "@/lib/ensure-roles";
import { prisma } from "@/lib/prisma";
import { canAccessFan, canAccessStudio, requireStudio, studioNav } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudio();
  try {
    await ensureSystemRoles();
  } catch (error) {
    console.error("studio.roles", error);
  }
  const groups = studioNav(user);
  let roleColor = user.role.color;
  try {
    const role = await prisma.role.findUnique({ where: { id: user.role.id } });
    roleColor = role?.color ?? roleColor;
  } catch {
    // Studio still renders if the color lookup fails.
  }

  return (
    <div className="studio-shell">
      <StudioNav
        eyebrow="Backstage"
        brand="Hall"
        name={user.name}
        roleName={user.role.name}
        roleColor={roleColor}
        imagePath={user.imagePath}
        showHall={canAccessStudio(user)}
        showFan={canAccessFan(user)}
        groups={groups}
        links={groups}
      />
      <div id="main-content" className="studio-main" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
