"use client";

import { useState } from "react";
import { Button, FormError } from "@repo/ui";

export function ExportAuditButton({ auditId }: { auditId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/audits/${auditId}/export`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? `audit-${auditId.slice(0, 8)}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/audits/${auditId}/export`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      const text = await res.text();
      await navigator.clipboard.writeText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={copy} disabled={busy}>
          Copy markdown
        </Button>
        <Button variant="primary" size="sm" onClick={download} disabled={busy}>
          Download .md
        </Button>
      </div>
      {error ? <FormError>{error}</FormError> : null}
    </div>
  );
}
