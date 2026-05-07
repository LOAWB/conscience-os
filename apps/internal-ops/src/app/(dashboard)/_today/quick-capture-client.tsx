"use client";

import { useState } from "react";
import { InlineNotice, QuickCapturePanel } from "@repo/ui";

/**
 * Client wrapper for QuickCapturePanel. Posts to /api/quick-capture (face-f).
 * Until face-f ships the handler, surface 404 as a clear demo state.
 */
export function QuickCaptureClient() {
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <QuickCapturePanel
        onSubmit={async ({ text, intent }) => {
          setSuccess(null);
          const res = await fetch("/api/quick-capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, intent }),
          });
          if (res.status === 404) {
            throw new Error(
              "/api/quick-capture not deployed yet (face-f wiring).",
            );
          }
          if (!res.ok) {
            const body = await res
              .json()
              .catch(() => ({ error: "Capture failed." }));
            throw new Error(body.error ?? `Capture failed (${res.status}).`);
          }
          setSuccess(`Captured as ${intent}.`);
        }}
      />
      {success ? (
        <InlineNotice variant="success">{success}</InlineNotice>
      ) : null}
    </div>
  );
}
