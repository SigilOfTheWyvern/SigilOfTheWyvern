import { DashFrame } from "@/components/dash-frame";
import { EmptyState } from "@/components/dash-ui";
import { getSiteSettings } from "@/lib/catalog";
import { requireUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function FanVaultPage() {
  const user = await requireUser();
  const settings = await getSiteSettings();
  const copy = settings["fan.vault"]?.trim();

  return (
    <DashFrame kicker="Collection" title="Vault">
      {copy ? (
        <article className="border border-blood/50 bg-obsidian p-8">
          <p className="font-display text-[10px] tracking-[0.28em] text-blood uppercase">
            Closed cut
          </p>
          <p className="mt-6 text-base leading-8 text-mist">{copy}</p>
        </article>
      ) : (
        <EmptyState title="Vault is empty" body="No private copy has been published for this hall yet." />
      )}
    </DashFrame>
  );
}
