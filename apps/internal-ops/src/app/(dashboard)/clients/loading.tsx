import { EntityListLoading, PageHeader } from "@repo/ui";

export default function ClientsLoading() {
  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader eyebrow="book of business" title="Clients" />
      <div className="mt-6">
        <EntityListLoading rows={8} />
      </div>
    </div>
  );
}
