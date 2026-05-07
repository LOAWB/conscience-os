import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

type Size = "sm" | "md";

const sizeStyles: Record<Size, string> = {
  sm: "size-8 [&>svg]:size-4",
  md: "size-10 [&>svg]:size-[18px]",
};

type Props = ComponentProps<"button"> & {
  size?: Size;
  label: string;
  children: ReactNode;
};

/**
 * Icon-only button. `label` is required for accessibility (becomes aria-label + sr-only text).
 * Use this for any button whose visible content is just an icon.
 */
export function IconButton({
  size = "md",
  label,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] hover:bg-white/[0.06] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 disabled:opacity-50 disabled:pointer-events-none",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}
