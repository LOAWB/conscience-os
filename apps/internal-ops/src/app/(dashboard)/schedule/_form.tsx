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
import type { Event } from "@repo/db";

const TYPE_OPTIONS = [
  { value: "audit", label: "Audit" },
  { value: "call", label: "Call" },
  { value: "deadline", label: "Deadline" },
  { value: "follow_up", label: "Follow-up" },
  { value: "other", label: "Other" },
];

const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

export function EventForm({
  initial,
  mode,
  clientOptions,
  projectOptions,
  leadOptions,
  defaults,
}: {
  initial?: Partial<Event>;
  mode: "create" | "edit";
  clientOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  leadOptions: { value: string; label: string }[];
  defaults?: { clientId?: string; projectId?: string; leadId?: string };
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
      const dateTime = fd.get("dateTime");
      if (!dateTime) throw new Error("Date and time required.");
      const body = {
        title: String(fd.get("title") ?? ""),
        type: String(fd.get("type") ?? "other"),
        dateTime: new Date(String(dateTime)).toISOString(),
        durationMinutes: Number(fd.get("durationMinutes") ?? 30),
        clientId: (fd.get("clientId") as string) || null,
        projectId: (fd.get("projectId") as string) || null,
        leadId: (fd.get("leadId") as string) || null,
        notes: (fd.get("notes") as string) || null,
      };

      const url =
        mode === "create" ? "/api/events" : `/api/events/${initial?.id}`;
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
      router.push(`/schedule/${j.item.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-2xl">
      <FormField label="Title" required>
        <TextInput
          name="title"
          required
          maxLength={300}
          defaultValue={initial?.title ?? ""}
        />
      </FormField>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormField label="Type">
          <Select
            name="type"
            defaultValue={initial?.type ?? "other"}
            options={TYPE_OPTIONS}
          />
        </FormField>
        <FormField label="Date & time" required>
          <DateTimePicker
            name="dateTime"
            required
            defaultValue={
              initial?.dateTime
                ? new Date(initial.dateTime).toISOString().slice(0, 16)
                : ""
            }
          />
        </FormField>
        <FormField label="Duration">
          <Select
            name="durationMinutes"
            defaultValue={String(initial?.durationMinutes ?? 30)}
            options={DURATION_OPTIONS}
          />
        </FormField>
      </div>

      <FormField label="Linked entity" hint="Pick at most one.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            name="clientId"
            defaultValue={initial?.clientId ?? defaults?.clientId ?? ""}
            options={[{ value: "", label: "— Client —" }, ...clientOptions]}
          />
          <Select
            name="projectId"
            defaultValue={initial?.projectId ?? defaults?.projectId ?? ""}
            options={[{ value: "", label: "— Project —" }, ...projectOptions]}
          />
          <Select
            name="leadId"
            defaultValue={initial?.leadId ?? defaults?.leadId ?? ""}
            options={[{ value: "", label: "— Lead —" }, ...leadOptions]}
          />
        </div>
      </FormField>

      <FormField label="Notes">
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
              ? "Schedule"
              : "Save changes"}
        </Button>
      </ActionBar>
    </form>
  );
}
