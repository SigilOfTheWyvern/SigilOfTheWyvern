import { DashHeader } from "@/components/dash-ui";

export default function StudioForbiddenPage() {
  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader
        kicker="Denied"
        title="This door is closed"
        hint="Your role does not hold this rite. The denial is logged."
      />
    </main>
  );
}
