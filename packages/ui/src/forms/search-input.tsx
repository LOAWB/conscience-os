import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type Props = Omit<ComponentProps<"input">, "type">;

/**
 * Search input — TextInput with a search icon prefix and a subtle focus glow.
 * Used at the top of every entity list.
 */
export const SearchInput = forwardRef<HTMLInputElement, Props>(
  function SearchInput({ className, placeholder = "Search…", ...props }, ref) {
    return (
      <div className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-foreground)]/45"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-md border border-[var(--color-border)] bg-white/[0.03] pl-10 pr-3 text-[0.92rem] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20 transition-colors duration-150",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
