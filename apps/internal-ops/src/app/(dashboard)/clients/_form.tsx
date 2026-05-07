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
  TextInput,
} from "@repo/ui";
import type { Client } from "@repo/db";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "offboarded", label: "Offboarded" },
];

type LinkRow = { label: string; url: string };

export function ClientForm({
  initial,
  mode,
}: {
  initial?: Partial<Client>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [links, setLinks] = useState<LinkRow[]>(
    Array.isArray(initial?.importantLinks)
      ? (initial!.importantLinks as LinkRow[])
      : [],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const cleanedLinks = links
        .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
        .filter((l) => l.label && l.url);

      const body = {
        businessName: String(fd.get("businessName") ?? ""),
        contactName: String(fd.get("contactName") ?? ""),
        email: (fd.get("email") as string) || null,
        phone: (fd.get("phone") as string) || null,
        status: String(fd.get("status") ?? "active"),
        notes: (fd.get("notes") as string) || null,
        importantLinks: cleanedLinks,
      };

      const url =
        mode === "create" ? "/api/clients" : `/api/clients/${initial?.id}`;
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
      router.push(`/clients/${j.item.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save client.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Business name" required>
          <TextInput
            name="businessName"
            required
            maxLength={200}
            defaultValue={initial?.businessName ?? ""}
          />
        </FormField>
        <FormField label="Contact name" required>
          <TextInput
            name="contactName"
            required
            maxLength={200}
            defaultValue={initial?.contactName ?? ""}
          />
        </FormField>
        <FormField label="Email">
          <TextInput
            type="email"
            name="email"
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
        <FormField label="Status">
          <Select
            name="status"
            defaultValue={initial?.status ?? "active"}
            options={STATUS_OPTIONS}
          />
        </FormField>
      </div>

      <FormField label="Internal notes">
        <TextArea
          name="notes"
          maxLength={8000}
          defaultValue={initial?.notes ?? ""}
        />
      </FormField>

      <FormField
        label="Important links"
        hint="External tools, dashboards, shared folders. label + URL per row."
      >
        <div className="flex flex-col gap-2">
          {links.map((l, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-2"
            >
              <TextInput
                value={l.label}
                placeholder="Label"
                maxLength={200}
                onChange={(e) => {
                  const next = [...links];
                  next[i] = { ...next[i], label: e.target.value };
                  setLinks(next);
                }}
              />
              <TextInput
                value={l.url}
                type="url"
                placeholder="https://…"
                maxLength={2000}
                onChange={(e) => {
                  const next = [...links];
                  next[i] = { ...next[i], url: e.target.value };
                  setLinks(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLinks(links.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLinks([...links, { label: "", url: "" }])}
          >
            + Add link
          </Button>
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
              ? "Create client"
              : "Save changes"}
        </Button>
      </ActionBar>
    </form>
  );
}
