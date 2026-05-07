"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ActionBar,
  Button,
  FormError,
  FormField,
  Select,
  TextArea,
} from "@repo/ui";
import type { Audit } from "@repo/db";

export function AuditForm({
  initial,
  mode,
  leadOptions,
  clientOptions,
  defaults,
}: {
  initial?: Partial<Audit>;
  mode: "create" | "edit";
  leadOptions: { value: string; label: string }[];
  clientOptions: { value: string; label: string }[];
  defaults?: { leadId?: string; clientId?: string };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const leadId = (fd.get("leadId") as string) || null;
      const clientId = (fd.get("clientId") as string) || null;

      if (mode === "create" && !leadId && !clientId) {
        throw new Error(
          "Audit must attach to a lead or client (CHECK constraint).",
        );
      }

      const baseBody = {
        businessOverview: (fd.get("businessOverview") as string) || null,
        currentTools: (fd.get("currentTools") as string) || null,
        painPoints: (fd.get("painPoints") as string) || null,
        opportunities: (fd.get("opportunities") as string) || null,
        recommendedSystems: (fd.get("recommendedSystems") as string) || null,
        nextSteps: (fd.get("nextSteps") as string) || null,
      };

      const url =
        mode === "create" ? "/api/audits" : `/api/audits/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      // F2-style: PATCH validator excludes leadId/clientId (set on create only).
      const body =
        mode === "create" ? { ...baseBody, leadId, clientId } : baseBody;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      const j = await res.json();
      router.push(`/audits/${j.item.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save audit.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-3xl">
      {mode === "create" ? (
        <FormField
          label="Subject"
          required
          hint="Audit must attach to a lead or a client. Pick exactly one."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              name="leadId"
              defaultValue={defaults?.leadId ?? ""}
              options={[{ value: "", label: "— Lead —" }, ...leadOptions]}
            />
            <Select
              name="clientId"
              defaultValue={defaults?.clientId ?? ""}
              options={[{ value: "", label: "— Client —" }, ...clientOptions]}
            />
          </div>
        </FormField>
      ) : null}

      <FormField
        label="Business overview"
        hint="What they do, who they serve, what runs the operation today."
      >
        <TextArea
          name="businessOverview"
          maxLength={20000}
          rows={4}
          defaultValue={initial?.businessOverview ?? ""}
        />
      </FormField>
      <FormField label="Current tools" hint="Stack, vendors, internal systems.">
        <TextArea
          name="currentTools"
          maxLength={20000}
          rows={4}
          defaultValue={initial?.currentTools ?? ""}
        />
      </FormField>
      <FormField
        label="Pain points"
        hint="What's costing them time, money, or trust today."
      >
        <TextArea
          name="painPoints"
          maxLength={20000}
          rows={4}
          defaultValue={initial?.painPoints ?? ""}
        />
      </FormField>
      <FormField
        label="Opportunities"
        hint="Where automation, integration, or design can compound."
      >
        <TextArea
          name="opportunities"
          maxLength={20000}
          rows={4}
          defaultValue={initial?.opportunities ?? ""}
        />
      </FormField>
      <FormField
        label="Recommended systems"
        hint="Concrete proposals — feeds the proposal markdown."
      >
        <TextArea
          name="recommendedSystems"
          maxLength={20000}
          rows={4}
          defaultValue={initial?.recommendedSystems ?? ""}
        />
      </FormField>
      <FormField label="Next steps">
        <TextArea
          name="nextSteps"
          maxLength={20000}
          rows={3}
          defaultValue={initial?.nextSteps ?? ""}
        />
      </FormField>

      {error ? <FormError>{error}</FormError> : null}

      <ActionBar align="right">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "File audit"
              : "Save changes"}
        </Button>
      </ActionBar>
    </form>
  );
}
