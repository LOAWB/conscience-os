import { PageHeader } from "@repo/ui";
import { LeadForm } from "../_form";

export default function NewLeadPage() {
  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="leads · new"
        title="New lead"
        description="Capture a lead manually. Public-site /book intake also lands here automatically."
      />
      <div className="mt-8">
        <LeadForm mode="create" />
      </div>
    </div>
  );
}
