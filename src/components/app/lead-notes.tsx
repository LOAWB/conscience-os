"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadNote } from "@/db/schema";

export function LeadNotes({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: LeadNote[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit() {
    if (!draft.trim()) return;
    setError("");
    startTransition(async () => {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Failed to add note");
        return;
      }
      setDraft("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl glass-card p-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Add a note — what they said on the call, follow-ups, anything you need to remember."
          className="w-full bg-transparent border-0 text-[0.95rem] text-foreground placeholder:text-subtle resize-y focus:outline-none"
        />
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
          {error ? (
            <p className="text-xs text-error">{error}</p>
          ) : (
            <p className="text-xs text-subtle font-mono">
              Cmd/Ctrl + Enter to save
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={pending || !draft.trim()}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-accent text-accent-foreground hover:bg-accent-hover disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {pending ? "Adding…" : "Add note"}
          </button>
        </div>
      </div>

      {initialNotes.length === 0 ? (
        <p className="text-sm text-subtle italic">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {initialNotes.map((note) => (
            <li key={note.id} className="rounded-xl glass-card p-4">
              <p className="text-[0.95rem] text-foreground whitespace-pre-wrap leading-relaxed">
                {note.body}
              </p>
              <p className="mt-3 text-[0.7rem] text-subtle font-mono">
                {note.author} · {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
