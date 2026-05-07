"use client";

import type { ChangeEvent } from "react";
import { cn } from "../lib/cn";

export function SwitchInput({
  checked,
  onChange,
  disabled,
  label,
  className,
  name,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  name?: string;
}) {
  function handle(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked);
  }
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <span className="relative inline-block w-9 h-5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handle}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full transition-colors duration-150 bg-white/[0.10] peer-checked:bg-[var(--color-accent)]/55 border border-[var(--color-border)]"
        />
        <span
          aria-hidden
          className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white/85 shadow transition-transform duration-150 peer-checked:translate-x-4"
        />
      </span>
      {label ? (
        <span className="text-sm text-[var(--color-foreground)]/85">
          {label}
        </span>
      ) : null}
    </label>
  );
}
