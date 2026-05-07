"use client";

import { useState } from "react";
import { TextArea } from "../forms/text-area";
import { Button } from "../primitives/button";
import { cn } from "../lib/cn";

/**
 * Note composer — textarea + submit. Used in lead/client detail timelines.
 * Caller wires the submit handler; component owns the local draft state.
 */
export function NoteComposer({
  placeholder = "Add a note…",
  submitLabel = "Add note",
  onSubmit,
  busy,
  className,
}: {
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (text: string) => Promise<void> | void;
  busy?: boolean;
  className?: string;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setError(null);
    try {
      await onSubmit(trimmed);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note.");
    }
  }

  return (
    <form onSubmit={handle} className={cn("flex flex-col gap-2", className)}>
      <TextArea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={busy}
      />
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs",
            error
              ? "text-[var(--color-error)]"
              : "text-[var(--color-foreground)]/40",
          )}
        >
          {error ?? `${draft.trim().length} chars`}
        </span>
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={busy || !draft.trim()}
        >
          {busy ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
