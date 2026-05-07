"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ConfirmDialog, FormError } from "@repo/ui";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteEvent() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      router.push("/schedule");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event.");
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteEvent}
        title="Delete this event?"
        description="The event will be removed permanently."
        confirmLabel="Delete"
        destructive
        busy={busy}
      />
      {error ? <FormError>{error}</FormError> : null}
    </>
  );
}
