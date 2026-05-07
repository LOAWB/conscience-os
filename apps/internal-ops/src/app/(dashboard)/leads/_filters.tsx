"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterTabs, Pagination, SearchInput, SortSelect } from "@repo/ui";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "new_lead", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "audit_scheduled", label: "Audit scheduled" },
  { value: "audit_completed", label: "Audit completed" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "on_hold", label: "On hold" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name", label: "Contact name" },
  { value: "business", label: "Business" },
  { value: "follow_up", label: "Next follow-up" },
] as const;

export function LeadsListFilters({
  status,
  search,
  sort,
  page,
  pageSize,
  total,
}: {
  status: string;
  search: string;
  sort: string;
  page: number;
  pageSize: number;
  total: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (value === null || value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs
          items={STATUS_TABS as unknown as { value: string; label: string }[]}
          value={status}
          onChange={(v) => setParam("status", v === "all" ? null : v)}
        />
        <div className="ml-auto flex items-center gap-2">
          <SortSelect
            options={
              SORT_OPTIONS as unknown as { value: string; label: string }[]
            }
            value={sort}
            onChange={(v) => setParam("sort", v === "newest" ? null : v)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SearchInput
          defaultValue={search}
          placeholder="Search by name, business, or email…"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setParam("search", (e.target as HTMLInputElement).value);
            }
          }}
          aria-busy={pending}
        />
      </div>
      <div className="flex items-center justify-end">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onChange={(p) => setParam("page", p === 1 ? null : String(p))}
        />
      </div>
    </div>
  );
}
