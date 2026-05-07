/**
 * Today View — locked 3-column dashboard composition.
 *
 * Stage 3.2 binding: Today reads real data via face-f's getTodaySnapshot()
 * (apps/internal-ops/src/lib/queries/today.ts). Demo banner + demo Tag rows
 * are gone per A4 ("Once /api/today is live and returns real data, the banner
 * and demo badges disappear automatically.").
 *
 * Suspense boundary streams the chrome (PageHeader) immediately and shows
 * EntityListLoading fallbacks while getTodaySnapshot resolves. On error,
 * <TodayError> renders an InlineNotice warning per Pory residual risk R1.
 */
import { Suspense } from "react";
import { PageHeader } from "@repo/ui";
import { getSession } from "@/lib/auth";
import { TodayContent } from "./_today/today-content";
import { TodayLoading } from "./_today/today-loading";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={`signed in · ${session.role}`}
        title={`Today${session.name ? `, ${session.name.split(" ")[0]}` : ""}.`}
        description="Open work, upcoming events, quick capture. One round-trip per refresh."
      />
      <Suspense fallback={<TodayLoading />}>
        <TodayContent />
      </Suspense>
    </div>
  );
}
