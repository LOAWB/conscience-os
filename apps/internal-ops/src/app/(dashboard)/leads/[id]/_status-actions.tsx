"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  FormError,
  InlineNotice,
} from "@repo/ui";
import { ChevronDown } from "lucide-react";
import type { LeadStatus } from "@repo/db";

const FORWARD_STATUSES: { from: LeadStatus; to: LeadStatus; label: string }[] =
  [
    { from: "new_lead", to: "contacted", label: "Mark contacted" },
    { from: "contacted", to: "audit_scheduled", label: "Schedule audit" },
    {
      from: "audit_scheduled",
      to: "audit_completed",
      label: "Audit completed",
    },
    { from: "audit_completed", to: "proposal_sent", label: "Send proposal" },
    { from: "proposal_sent", to: "won", label: "Mark won" },
  ];

const OTHER_TRANSITIONS: { value: LeadStatus; label: string }[] = [
  { value: "new_lead", label: "New lead" },
  { value: "contacted", label: "Contacted" },
  { value: "audit_scheduled", label: "Audit scheduled" },
  { value: "audit_completed", label: "Audit completed" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "on_hold", label: "On hold" },
];

export function LeadStatusActions({
  leadId,
  status,
  alreadyConvertedClientId,
}: {
  leadId: string;
  status: LeadStatus;
  alreadyConvertedClientId: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);

  const next = FORWARD_STATUSES.find((s) => s.from === status);

  async function patchStatus(to: LeadStatus) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: to }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setBusy(false);
    }
  }

  async function convert() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
      });
      const j = await res.json().catch(() => ({}));
      if (res.status === 422 && j.clientId) {
        router.push(`/clients/${j.clientId}`);
        return;
      }
      if (!res.ok) throw new Error(j.error ?? `Failed (${res.status})`);
      router.push(j.redirectTo ?? `/clients/${j.client.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert lead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {next ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => patchStatus(next.to)}
            disabled={busy}
          >
            {next.label}
          </Button>
        ) : null}

        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm" disabled={busy}>
              Other status… <ChevronDown className="ml-1.5 size-3.5" />
            </Button>
          }
          items={OTHER_TRANSITIONS.filter((o) => o.value !== status).map(
            (o) => ({
              label: o.label,
              onSelect: () => patchStatus(o.value),
            }),
          )}
        />

        {status === "won" || alreadyConvertedClientId ? (
          alreadyConvertedClientId ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                router.push(`/clients/${alreadyConvertedClientId}`)
              }
            >
              Open client
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConvertOpen(true)}
              disabled={busy}
            >
              Convert to client
            </Button>
          )
        ) : null}
      </div>

      {status === "lost" ? (
        <InlineNotice variant="warn" title="Reason recommended">
          Add a brief reason to the internal notes so future audits can learn
          from this loss.
        </InlineNotice>
      ) : null}

      {error ? <FormError>{error}</FormError> : null}

      <ConfirmDialog
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        onConfirm={async () => {
          setConvertOpen(false);
          await convert();
        }}
        title="Convert lead to client?"
        description="This creates a new client record copying this lead's contact info, marks the lead as won, and redirects to the new client."
        confirmLabel="Convert"
        busy={busy}
      />
    </div>
  );
}
