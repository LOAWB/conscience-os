import { EntityListLoading, SectionHeader, TodayPanel } from "@repo/ui";

export function TodayLoading() {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white/[0.018] backdrop-blur-md px-4 py-3.5 h-[78px] animate-pulse"
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TodayPanel
          header={<SectionHeader title="Today's tasks" hint="loading" />}
        >
          <EntityListLoading rows={4} />
        </TodayPanel>
        <TodayPanel header={<SectionHeader title="Upcoming" hint="loading" />}>
          <EntityListLoading rows={4} />
        </TodayPanel>
        <TodayPanel header={<SectionHeader title="Quick capture" />}>
          <div className="space-y-2 animate-pulse">
            <div className="h-24 rounded-md bg-white/[0.04]" />
            <div className="h-9 rounded-md bg-white/[0.04] w-32" />
          </div>
        </TodayPanel>
      </div>
    </>
  );
}
