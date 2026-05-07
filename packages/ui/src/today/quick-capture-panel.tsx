"use client";

import { useState } from "react";
import { TextArea } from "../forms/text-area";
import { Select } from "../forms/select";
import { Button } from "../primitives/button";
import { FormError } from "../forms/form-error";
import { cn } from "../lib/cn";

export type QuickCaptureIntent = "task" | "event" | "lead-followup";

const INTENT_OPTIONS: { value: QuickCaptureIntent; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "event", label: "Event" },
  { value: "lead-followup", label: "Lead follow-up" },
];

/**
 * Quick capture — textarea + intent selector + submit. Posts to /api/quick-capture
 * (face-f handler). On success, caller refreshes relevant column. On failure,
 * surface inline error via FormError.
 *
 * Component owns the local draft + intent state. Caller wires the submit handler.
 */
export function QuickCapturePanel({
  onSubmit,
  defaultIntent = "task",
  className,
}: {
  onSubmit: (input: {
    text: string;
    intent: QuickCaptureIntent;
  }) => Promise<void> | void;
  defaultIntent?: QuickCaptureIntent;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<QuickCaptureIntent>(defaultIntent);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setError(null);
    setBusy(true);
    try {
      await onSubmit({ text: trimmed, intent });
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handle} className={cn("flex flex-col gap-3", className)}>
      <TextArea
        placeholder="Note, idea, follow-up…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        disabled={busy}
      />
      {error ? <FormError>{error}</FormError> : null}
      <div className="flex items-center gap-2">
        <Select
          value={intent}
          onChange={(e) => setIntent(e.target.value as QuickCaptureIntent)}
          options={INTENT_OPTIONS}
          className="h-9 max-w-[160px] text-[0.85rem]"
          disabled={busy}
        />
        <div className="flex-1" />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={busy || !text.trim()}
        >
          {busy ? "Capturing…" : "Capture →"}
        </Button>
      </div>
    </form>
  );
}
