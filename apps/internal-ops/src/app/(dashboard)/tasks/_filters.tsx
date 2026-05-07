"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterTabs, Pagination, SearchInput, SortSelect } from "@repo/ui";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "to_do", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "waiting", label: "Waiting" },
  { value: "done", label: "Done" },
];

const PRIORITY_TABS = [
  { value: "all", label: "Any" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const SORT_OPTIONS = [
  { value: "due_date", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "newest", label: "Newest" },
  { value: "title", label: "Title" },
];

export function TasksListFilters({
  status,
  priority,
  search,
  sort,
  page,
  pageSize,
  total,
}: {
  status: string;
  priority: string;
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
        <FilterTabs
          items={PRIORITY_TABS}
          value={priority}
          onChange={(v) => setParam("priority", v === "all" ? null : v)}
        />
        <div className="ml-auto">
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={(v) => setParam("sort", v === "due_date" ? null : v)}
          />
        </div>
      </div>
      <SearchInput
        defaultValue={search}
        placeholder="Search by title or description…"
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
