import { StudioNav } from "@/components/studio-nav";
import { prisma } from "@/lib/prisma";
import { requireStudio, studioNav } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudio();
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
        role={`${user.name} · ${user.role.name}`}
        roleColor={roleColor}
        groups={groups}
        links={groups}
      />
      <div id="main-content" className="studio-main" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
