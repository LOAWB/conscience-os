"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Item =
  | {
      type?: "item";
      label: ReactNode;
      onSelect: () => void;
      destructive?: boolean;
    }
  | { type: "divider" };

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className,
}: {
  trigger: ReactNode;
  items: Item[];
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-full mt-1 min-w-[180px] rounded-lg border border-[var(--color-border)] bg-[#0a0d14] shadow-xl py-1 z-30",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((it, i) =>
            it.type === "divider" ? (
              <div
                key={i}
                aria-hidden
                className="my-1 border-t border-[var(--color-border)]"
              />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  it.onSelect();
                }}
                className={cn(
                  "block w-full px-3 py-1.5 text-left text-sm hover:bg-white/[0.04] transition-colors",
                  it.destructive
                    ? "text-[var(--color-error)]"
                    : "text-[var(--color-foreground)]/85",
                )}
              >
                {it.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
