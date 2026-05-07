"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { IconButton } from "../primitives/icon-button";

export function Modal({
  open,
  onClose,
  title,
  description,
  width = 440,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  width?: number;
  children?: ReactNode;
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

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative aura-card rounded-xl flex flex-col max-h-[85vh]",
          className,
        )}
        style={{ width }}
      >
        {(title || description) && (
          <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
            <div className="min-w-0">
              {title ? (
                <h2 className="text-lg font-semibold tracking-tight text-[var(--color-foreground)]">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-[var(--color-foreground)]/65">
                  {description}
                </p>
              ) : null}
            </div>
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
        )}
        {children ? (
          <div className="px-5 pb-5 overflow-y-auto">{children}</div>
        ) : null}
        {footer ? <div>{footer}</div> : null}
      </div>
    </div>
  );
}
