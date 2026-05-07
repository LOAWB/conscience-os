import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type Props = Omit<ComponentProps<"input">, "type"> & {
  label?: string;
};

export const CheckboxInput = forwardRef<HTMLInputElement, Props>(
  function CheckboxInput({ label, className, id, ...props }, ref) {
    const inputId = id ?? props.name ?? undefined;
    const input = (
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={cn(
          "size-4 rounded border border-[var(--color-border-strong)] bg-white/[0.03] text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 cursor-pointer",
          className,
        )}
        {...props}
      />
    );
    if (!label) return input;
    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2 cursor-pointer select-none text-sm text-[var(--color-foreground)]/85"
      >
        {input}
        <span>{label}</span>
      </label>
    );
  },
);
