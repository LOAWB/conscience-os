"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Checklist, FormError, ProgressBar, TextInput } from "@repo/ui";

type Deliverable = { label: string; done: boolean; dueAt?: string | null };

export function DeliverablesEditor({
  projectId,
  initial,
}: {
  projectId: string;
  initial: Deliverable[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<Deliverable[]>(initial);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function persist(next: Deliverable[]) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/deliverables`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliverables: next }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      setItems(next);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save deliverables.",
      );
    } finally {
      setBusy(false);
    }
  }

  const checklistItems = items.map((d, i) => ({
    id: String(i),
    label: d.label,
    done: d.done,
  }));

  const done = items.filter((d) => d.done).length;

  return (
    <div className="flex flex-col gap-4">
      {items.length > 0 ? (
        <ProgressBar
          value={done}
          max={items.length}
          label={`${done} of ${items.length} done`}
        />
      ) : null}

      <Checklist
        items={checklistItems}
        onToggle={(id, next) => {
          const idx = parseInt(id, 10);
          if (Number.isNaN(idx)) return;
          const updated = [...items];
          updated[idx] = { ...updated[idx], done: next };
          void persist(updated);
        }}
        emptyState={
          <p className="text-sm text-[var(--color-foreground)]/55 italic">
            No deliverables yet. Add the first below.
          </p>
        }
      />

      <div className="flex flex-col gap-2">
        {items.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput
              value={d.label}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], label: e.target.value };
                setItems(next);
              }}
              onBlur={() => persist(items)}
              maxLength={300}
              className="text-[0.85rem]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => persist(items.filter((_, j) => j !== i))}
              disabled={busy}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = draft.trim();
          if (!trimmed) return;
          setDraft("");
          void persist([...items, { label: trimmed, done: false }]);
        }}
      >
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a deliverable and press Enter…"
          maxLength={300}
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={busy || !draft.trim()}
        >
          Add
        </Button>
      </form>

      {error ? <FormError>{error}</FormError> : null}
    </div>
  );
}
