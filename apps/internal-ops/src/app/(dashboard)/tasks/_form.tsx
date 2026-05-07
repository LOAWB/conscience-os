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
import type { Task } from "@repo/db";

const STATUS_OPTIONS = [
  { value: "to_do", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "waiting", label: "Waiting" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export function TaskForm({
  initial,
  mode,
  clientOptions,
  projectOptions,
  leadOptions,
  defaults,
  onSaved,
}: {
  initial?: Partial<Task>;
  mode: "create" | "edit";
  clientOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  leadOptions: { value: string; label: string }[];
  defaults?: { clientId?: string; projectId?: string; leadId?: string };
  onSaved?: (task: Task) => void;
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
        title: String(fd.get("title") ?? ""),
        description: (fd.get("description") as string) || null,
        status: String(fd.get("status") ?? "to_do"),
        priority: String(fd.get("priority") ?? "medium"),
        dueDate: fd.get("dueDate")
          ? new Date(String(fd.get("dueDate"))).toISOString()
          : null,
        clientId: (fd.get("clientId") as string) || null,
        projectId: (fd.get("projectId") as string) || null,
        leadId: (fd.get("leadId") as string) || null,
      };

      const url =
        mode === "create" ? "/api/tasks" : `/api/tasks/${initial?.id}`;
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
      if (onSaved) onSaved(j.item);
      else {
        router.push("/tasks");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormField label="Title" required>
        <TextInput
          name="title"
          required
          maxLength={300}
          defaultValue={initial?.title ?? ""}
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
            defaultValue={initial?.status ?? "to_do"}
            options={STATUS_OPTIONS}
          />
        </FormField>
        <FormField label="Priority">
          <Select
            name="priority"
            defaultValue={initial?.priority ?? "medium"}
            options={PRIORITY_OPTIONS}
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

      <FormField
        label="Link"
        hint="Pick at most one — client, project, or lead."
      >
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
              ? "Create task"
              : "Save changes"}
        </Button>
      </ActionBar>
    </form>
  );
}
