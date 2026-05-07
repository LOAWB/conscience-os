import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Top-of-form error surface. Distinct from FormField's per-field error.
 * Use for "Invalid email or password." / 422 / network error class messages.
 */
export function FormError({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border border-[rgba(248,113,113,0.30)] bg-[rgba(248,113,113,0.08)] px-3 py-2 text-sm text-[var(--color-error)]",
        className,
      )}
    >
      <svg
        aria-hidden
        className="mt-0.5 size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
