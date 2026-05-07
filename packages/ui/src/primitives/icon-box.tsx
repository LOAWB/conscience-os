import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, string> = {
  sm: "size-8 [&>svg]:size-4",
  md: "size-10 [&>svg]:size-[18px]",
  lg: "size-12 [&>svg]:size-5",
};

/**
 * Icon-box — small rounded container with blue gradient + inner glow.
 * Wraps a lucide icon. Used for sidebar nav items, stat cards, list-row prefixes.
 */
export function IconBox({
  children,
  size = "md",
  className,
}: {
  children: ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "icon-box rounded-lg inline-flex items-center justify-center text-[#9bbcff]",
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
