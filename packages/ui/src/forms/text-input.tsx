import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export const inputBase =
  "h-11 w-full rounded-md border border-[var(--color-border)] bg-white/[0.03] px-3.5 text-[0.95rem] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150";

export const TextInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(inputBase, className)} {...props} />;
  },
);
