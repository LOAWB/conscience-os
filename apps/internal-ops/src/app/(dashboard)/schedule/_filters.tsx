"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterTabs, SearchInput } from "@repo/ui";

const RANGE_TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "past", label: "Past" },
];

const TYPE_TABS = [
  { value: "all", label: "All types" },
  { value: "audit", label: "Audit" },
  { value: "call", label: "Call" },
  { value: "deadline", label: "Deadline" },
  { value: "follow_up", label: "Follow-up" },
  { value: "other", label: "Other" },
];

export function ScheduleFilters({
  range,
  type,
  search,
}: {
  range: string;
  type: string;
  search: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (value === null || value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() =>
      router.replace(`?${next.toString()}`, { scroll: false }),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs
          items={RANGE_TABS}
          value={range}
          onChange={(v) => setParam("range", v === "upcoming" ? null : v)}
        />
        <FilterTabs
          items={TYPE_TABS}
          value={type}
          onChange={(v) => setParam("type", v === "all" ? null : v)}
        />
      </div>
      <SearchInput
        defaultValue={search}
        placeholder="Search by title or notes…"
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setParam("search", (e.target as HTMLInputElement).value);
        }}
      />
    </div>
  );
}
