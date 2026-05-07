"use client";

import { useRouter } from "next/navigation";
import { NoteComposer, Timeline } from "@repo/ui";
import type { LeadNote } from "@repo/db";

export function LeadNotesTimeline({
  leadId,
  notes,
}: {
  leadId: string;
  notes: LeadNote[];
}) {
  const router = useRouter();
  const items = notes.map((n) => ({
    id: n.id,
    at: new Date(n.createdAt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    title: n.body,
    by: n.author,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Timeline
        items={items}
        emptyState={
          <p className="text-sm text-[var(--color-foreground)]/55 italic">
            No notes yet — add the first below.
          </p>
        }
      />
      <NoteComposer
        placeholder="Note this lead's latest signal, blocker, or next step…"
        onSubmit={async (text) => {
          const res = await fetch(`/api/leads/${leadId}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: text, author: "Operator" }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error ?? `Failed (${res.status})`);
          }
          router.refresh();
        }}
      />
    </div>
  );
}
