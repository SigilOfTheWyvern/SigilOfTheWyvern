import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("fan", "view");
  return children;
}
