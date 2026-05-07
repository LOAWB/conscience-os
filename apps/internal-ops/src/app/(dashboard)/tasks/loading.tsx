import { EntityListLoading, PageHeader } from "@repo/ui";

export default function TasksLoading() {
  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader eyebrow="execution" title="Tasks" />
      <div className="mt-6">
        <EntityListLoading rows={10} />
      </div>
    </div>
  );
}
