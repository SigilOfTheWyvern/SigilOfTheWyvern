export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-[11px] tracking-[0.32em] text-blood uppercase">
        {index}
      </span>
      <span className="h-px max-w-16 flex-1 bg-blood/70" />
      <p className="font-display text-[11px] tracking-[0.32em] text-mist uppercase">
        {children}
      </p>
    </div>
  );
}
