import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Variant = "info" | "warn" | "success" | "demo";

const variantStyles: Record<
  Variant,
  { bg: string; border: string; color: string; icon: ReactNode }
> = {
  info: {
    bg: "rgba(59,125,255,0.08)",
    border: "rgba(59,125,255,0.28)",
    color: "#9bbcff",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warn: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.28)",
    color: "#fbbf24",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  success: {
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.28)",
    color: "#34d399",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  demo: {
    bg: "transparent",
    border: "rgba(244,244,245,0.20)",
    color: "rgba(244,244,245,0.55)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

/**
 * Inline notice — banner-style notifications anchored to a section.
 * The "demo" variant is the canonical mock-data label per A4.
 */
export function InlineNotice({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const style = variantStyles[variant];
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-md border px-3 py-2 text-sm",
        variant === "demo" && "border-dashed",
        className,
      )}
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
    >
      <span className="mt-0.5 size-4 shrink-0">{style.icon}</span>
      <div className="min-w-0">
        {title ? <div className="font-medium">{title}</div> : null}
        {children ? <div className="text-[0.85rem]">{children}</div> : null}
      </div>
    </div>
  );
}

export const Toast = InlineNotice;
