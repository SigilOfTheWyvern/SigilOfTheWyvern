import { StudioNav } from "@/components/studio-nav";
import { prisma } from "@/lib/prisma";
import { requireStudio, studioNav } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudio();
  const groups = studioNav(user);
  const role = await prisma.role.findUnique({ where: { id: user.role.id } });

  return (
    <div className="studio-shell">
      <StudioNav
        role={`${user.name} · ${user.role.name}`}
        roleColor={role?.color ?? "#c4a574"}
        groups={groups}
        links={groups}
      />
      <div className="studio-main">{children}</div>
    </div>
  );
}
