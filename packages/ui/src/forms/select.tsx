import { forwardRef } from "react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

type Option = { value: string; label: string };

type Props = ComponentProps<"select"> & {
  options?: Option[];
  children?: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { options, className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-md border border-[var(--color-border)] bg-white/[0.03] pl-3.5 pr-10 text-[0.95rem] text-[var(--color-foreground)] focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150",
          className,
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-foreground)]/45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
});
