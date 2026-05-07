"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterTabs, Pagination, SearchInput, SortSelect } from "@repo/ui";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "discovery", label: "Discovery" },
  { value: "planning", label: "Planning" },
  { value: "building", label: "Building" },
  { value: "review", label: "Review" },
  { value: "deployed", label: "Deployed" },
  { value: "support", label: "Support" },
  { value: "complete", label: "Complete" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "due_date", label: "Due date" },
  { value: "name", label: "Name" },
];

export function ProjectsListFilters({
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
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (value === null || value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    startTransition(() =>
      router.replace(`?${next.toString()}`, { scroll: false }),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs
          items={STATUS_TABS}
          value={status}
          onChange={(v) => setParam("status", v === "all" ? null : v)}
        />
        <div className="ml-auto">
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={(v) => setParam("sort", v === "newest" ? null : v)}
          />
        </div>
      </div>
      <SearchInput
        defaultValue={search}
        placeholder="Search by name or description…"
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setParam("search", (e.target as HTMLInputElement).value);
        }}
      />
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
