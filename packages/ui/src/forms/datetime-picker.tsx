import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { inputBase } from "./text-input";

/**
 * Native datetime-local wrapper. Per FACE-E-UI.md risk note:
 * "looks platform-y on Mac" — accepted trade-off for M0. Custom date picker
 * deferred to M2.
 */
export const DateTimePicker = forwardRef<
  HTMLInputElement,
  Omit<ComponentProps<"input">, "type">
>(function DateTimePicker({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="datetime-local"
      className={cn(inputBase, "pr-3 [color-scheme:dark]", className)}
      {...props}
    />
  );
});
