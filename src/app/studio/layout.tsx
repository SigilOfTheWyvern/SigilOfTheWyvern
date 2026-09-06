import { StudioNav } from "@/components/studio-nav";
import { prisma } from "@/lib/prisma";
import { requireStudio, studioNav } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudio();
  const links = studioNav(user);
  const role = await prisma.role.findUnique({ where: { id: user.role.id } });

  return (
    <div className="relative z-10 min-h-screen">
      <StudioNav
        role={`${user.name} · ${user.role.name}`}
        roleColor={role?.color ?? "#c4a574"}
        links={links}
      />
      <div className="min-w-0 pt-[4.75rem] lg:pt-0 lg:pl-64">{children}</div>
    </div>
  );
}
