import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Wrapper for a labeled form input. Composes with TextInput / TextArea / Select / etc.
 *
 * <FormField label="Email" hint="We never share." error={errors.email}>
 *   <TextInput name="email" ... />
 * </FormField>
 */
export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label != null ? (
        <label
          htmlFor={htmlFor}
          className="text-xs uppercase tracking-wider text-[var(--color-foreground)]/65 font-medium"
        >
          {label}
          {required ? (
            <span className="ml-1 text-[var(--color-accent)]">•</span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-foreground)]/50">{hint}</p>
      ) : null}
    </div>
  );
}
