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
import type { Project } from "@repo/db";

const STATUS_OPTIONS = [
  { value: "discovery", label: "Discovery" },
  { value: "planning", label: "Planning" },
  { value: "building", label: "Building" },
  { value: "review", label: "Review" },
  { value: "deployed", label: "Deployed" },
  { value: "support", label: "Support" },
  { value: "complete", label: "Complete" },
];

export function ProjectForm({
  initial,
  mode,
  clientOptions,
  defaultClientId,
}: {
  initial?: Partial<Project>;
  mode: "create" | "edit";
  clientOptions: { value: string; label: string }[];
  defaultClientId?: string;
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
        clientId: String(fd.get("clientId") ?? ""),
        name: String(fd.get("name") ?? ""),
        description: (fd.get("description") as string) || null,
        status: String(fd.get("status") ?? "discovery"),
        dueDate: fd.get("dueDate")
          ? new Date(String(fd.get("dueDate"))).toISOString()
          : null,
        internalNotes: (fd.get("internalNotes") as string) || null,
      };

      const url =
        mode === "create" ? "/api/projects" : `/api/projects/${initial?.id}`;
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
      router.push(`/projects/${j.item.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-2xl">
      <FormField label="Client" required>
        <Select
          name="clientId"
          required
          defaultValue={initial?.clientId ?? defaultClientId ?? ""}
          options={[{ value: "", label: "Select client…" }, ...clientOptions]}
        />
      </FormField>
      <FormField label="Project name" required>
        <TextInput
          name="name"
          required
          maxLength={200}
          defaultValue={initial?.name ?? ""}
        />
      </FormField>
      <FormField label="Description">
        <TextArea
          name="description"
          maxLength={8000}
          defaultValue={initial?.description ?? ""}
        />
      </FormField>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Status">
          <Select
            name="status"
            defaultValue={initial?.status ?? "discovery"}
            options={STATUS_OPTIONS}
          />
        </FormField>
        <FormField label="Due date">
          <DateTimePicker
            name="dueDate"
            defaultValue={
              initial?.dueDate
                ? new Date(initial.dueDate).toISOString().slice(0, 16)
                : ""
            }
          />
        </FormField>
      </div>
      <FormField label="Internal notes">
        <TextArea
          name="internalNotes"
          maxLength={8000}
          defaultValue={initial?.internalNotes ?? ""}
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
              ? "Create project"
              : "Save changes"}
        </Button>
      </ActionBar>
    </form>
  );
}
