"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ActionBar,
  Button,
  DateTimePicker,
  FormError,
  FormField,
  Select,
  TextArea,
  TextInput,
} from "@repo/ui";
import type { Lead } from "@repo/db";

const STATUS_OPTIONS = [
  { value: "new_lead", label: "New lead" },
  { value: "contacted", label: "Contacted" },
  { value: "audit_scheduled", label: "Audit scheduled" },
  { value: "audit_completed", label: "Audit completed" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "on_hold", label: "On hold" },
];

const TIER_OPTIONS = [
  { value: "audit", label: "Audit" },
  { value: "build", label: "Build" },
  { value: "support", label: "Support" },
  { value: "not-sure", label: "Not sure" },
];

export function LeadForm({
  initial,
  mode,
}: {
  initial?: Partial<Lead>;
  mode: "create" | "edit";
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
      const body = {
        name: String(fd.get("name") ?? ""),
        businessName: String(fd.get("businessName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: (fd.get("phone") as string) || null,
        businessType: (fd.get("businessType") as string) || "",
        problems: (fd.get("problems") as string) || "",
        tools: (fd.get("tools") as string) || "",
        outcome: (fd.get("outcome") as string) || "",
        tier: String(fd.get("tier") ?? "audit"),
        status: String(fd.get("status") ?? "new_lead"),
        notes: (fd.get("notes") as string) || null,
        nextFollowUpAt: fd.get("nextFollowUpAt")
          ? new Date(String(fd.get("nextFollowUpAt"))).toISOString()
          : null,
      };

      const url =
        mode === "create" ? "/api/leads" : `/api/leads/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
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
      router.push(`/leads/${j.item.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lead.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Contact name" required>
          <TextInput
            name="name"
            required
            maxLength={200}
            defaultValue={initial?.name ?? ""}
          />
        </FormField>
        <FormField label="Business name" required>
          <TextInput
            name="businessName"
            required
            maxLength={200}
            defaultValue={initial?.businessName ?? initial?.business ?? ""}
          />
        </FormField>
        <FormField label="Email" required>
          <TextInput
            type="email"
            name="email"
            required
            maxLength={320}
            defaultValue={initial?.email ?? ""}
          />
        </FormField>
        <FormField label="Phone">
          <TextInput
            name="phone"
            maxLength={40}
            defaultValue={initial?.phone ?? ""}
          />
        </FormField>
        <FormField label="Business type">
          <TextInput
            name="businessType"
            maxLength={120}
            defaultValue={initial?.businessType ?? ""}
          />
        </FormField>
        <FormField label="Tier">
          <Select
            name="tier"
            defaultValue={initial?.tier ?? "audit"}
            options={TIER_OPTIONS}
          />
        </FormField>
        <FormField label="Pipeline status">
          <Select
            name="status"
            defaultValue={initial?.status ?? "new_lead"}
            options={STATUS_OPTIONS}
          />
        </FormField>
        <FormField label="Next follow-up">
          <DateTimePicker
            name="nextFollowUpAt"
            defaultValue={
              initial?.nextFollowUpAt
                ? new Date(initial.nextFollowUpAt).toISOString().slice(0, 16)
                : ""
            }
          />
        </FormField>
      </div>

      <FormField label="Problems they raised">
        <TextArea
          name="problems"
          maxLength={4000}
          defaultValue={initial?.problems ?? ""}
        />
      </FormField>
      <FormField label="Tools they use today">
        <TextArea
          name="tools"
          maxLength={4000}
          defaultValue={initial?.tools ?? ""}
        />
      </FormField>
      <FormField label="Desired outcome">
        <TextArea
          name="outcome"
          maxLength={4000}
          defaultValue={initial?.outcome ?? ""}
        />
      </FormField>
      <FormField
        label="Internal notes"
        hint="Free-form, only operators see this."
      >
        <TextArea
          name="notes"
          maxLength={8000}
          defaultValue={initial?.notes ?? ""}
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
              ? "Create lead"
              : "Save changes"}
        </Button>
      </ActionBar>
    </form>
  );
}
