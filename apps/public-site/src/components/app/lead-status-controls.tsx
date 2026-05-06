"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus, LeadTier } from "@/db/schema";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "in_audit",
  "won",
  "lost",
  "archived",
];

const TIERS: LeadTier[] = ["audit", "build", "support", "not-sure"];

export function LeadStatusControls({
  leadId,
  initialStatus,
  initialTier,
  initialNextAction,
}: {
  leadId: string;
  initialStatus: LeadStatus;
  initialTier: LeadTier;
  initialNextAction: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [tier, setTier] = useState<LeadTier>(initialTier);
  const [nextAction, setNextAction] = useState(initialNextAction || "");
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function patch(payload: Record<string, unknown>) {
    startTransition(async () => {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSavedAt(new Date());
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-xl glass-card p-5 space-y-5">
      <div>
        <p className="text-[0.7rem] font-mono uppercase tracking-wider text-subtle mb-2">
          Current
        </p>
        <StatusBadge status={status} />
      </div>

      <div>
        <label className="text-[0.7rem] font-mono uppercase tracking-wider text-subtle block mb-2">
          Move to
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s);
                patch({ status: s });
              }}
              disabled={pending || s === status}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-[0.72rem] font-mono uppercase tracking-wider border transition-colors",
                s === status
                  ? "border-accent text-accent bg-accent/10"
                  : "border-white/[0.08] text-muted-foreground hover:border-accent/40 hover:text-foreground",
              )}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[0.7rem] font-mono uppercase tracking-wider text-subtle block mb-2">
          Tier
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTier(t);
                patch({ tier: t });
              }}
              disabled={pending || t === tier}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-[0.72rem] font-mono uppercase tracking-wider border transition-colors",
                t === tier
                  ? "border-accent text-accent bg-accent/10"
                  : "border-white/[0.08] text-muted-foreground hover:border-accent/40 hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="nextAction"
          className="text-[0.7rem] font-mono uppercase tracking-wider text-subtle block mb-2"
        >
          Next action
        </label>
        <textarea
          id="nextAction"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          onBlur={() => patch({ nextAction: nextAction || null })}
          rows={3}
          placeholder="Schedule kickoff call…"
          className="w-full rounded-md bg-white/[0.03] border border-border text-[0.88rem] text-foreground placeholder:text-subtle px-3 py-2 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <p className="text-[0.7rem] font-mono text-subtle">
        {pending
          ? "Saving…"
          : savedAt
            ? `Saved ${savedAt.toLocaleTimeString()}`
            : "Auto-saves on change"}
      </p>
    </div>
  );
}
