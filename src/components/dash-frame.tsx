import { DashHeader } from "@/components/dash-ui";

export const fanGroups = [
  {
    id: "hall",
    label: "Hall",
    links: [{ href: "/fan", label: "Overview" }],
  },
  {
    id: "collection",
    label: "Collection",
    links: [
      { href: "/fan/orders", label: "Orders" },
      { href: "/fan/tickets", label: "Tickets" },
      { href: "/fan/saved", label: "Saved" },
      { href: "/fan/vault", label: "Vault" },
    ],
  },
  {
    id: "account",
    label: "Account",
    links: [
      { href: "/fan/notifications", label: "Notices" },
      { href: "/fan/profile", label: "Profile" },
    ],
  },
];

export const fanLinks = fanGroups.flatMap((group) => group.links);

export function DashFrame({
  kicker,
  title,
  hint,
  children,
}: {
  kicker: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 md:px-10 md:py-14">
      <DashHeader kicker={kicker} title={title} hint={hint} />
      {children}
    </main>
  );
}
