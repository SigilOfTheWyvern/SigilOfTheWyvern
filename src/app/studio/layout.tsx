import { StudioNav } from "@/components/studio-nav";
import { prisma } from "@/lib/prisma";
import { requireStudio, studioNav } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudio();
  const links = studioNav(user);
  const role = await prisma.role.findUnique({ where: { id: user.role.id } });

  return (
    <div className="relative z-10 flex h-dvh flex-col overflow-hidden lg:flex-row">
      <StudioNav
        role={`${user.name} · ${user.role.name}`}
        roleColor={role?.color ?? "#c4a574"}
        groups={links}
      />
      <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  );
}
