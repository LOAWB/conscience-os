"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { IconButton } from "../primitives/icon-button";

/**
 * Drawer — right-side slide-in panel. Used by Tasks list (per F2 amendment) and
 * any place an operator wants entity detail without losing list context.
 *
 * Renders portal-style fixed overlay. ESC + outside-click close. Body-scroll
 * locked while open.
 */
export function Drawer({
  open,
  onClose,
  title,
  width = 480,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-200",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute right-0 top-0 h-full bg-[var(--color-background)] border-l border-[var(--color-border)] shadow-2xl flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
          className,
        )}
        style={{ width }}
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold tracking-tight text-[var(--color-foreground)] truncate">
            {title}
          </h2>
          <IconButton size="sm" label="Close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer ? (
          <div className="border-t border-[var(--color-border)]">{footer}</div>
        ) : null}
      </aside>
    </div>
  );
}
