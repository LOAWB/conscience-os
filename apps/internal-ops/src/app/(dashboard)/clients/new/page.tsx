import { PageHeader } from "@repo/ui";
import { ClientForm } from "../_form";

export default function NewClientPage() {
  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="clients · new"
        title="New client"
        description="Add a client manually, or convert a won lead from /leads."
      />
      <div className="mt-8">
        <ClientForm mode="create" />
      </div>
    </div>
  );
}
