import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-white px-3.5 text-[0.95rem] text-foreground placeholder:text-subtle",
        "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20",
        "disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-border bg-white px-3.5 py-3 text-[0.95rem] text-foreground placeholder:text-subtle",
        "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20",
        "disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 resize-y",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  children,
  ...props
}: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-foreground block mb-2",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
